import mongoose from "mongoose";
import { User } from "../models/User";
import { Institution } from "../models/Institution";
import PasswordUtils from "../utils/PasswordUtils";
import haversine from "haversine-distance";

async function create(req, res) {
  try {
    if (req.emailInUse) {
      return res
        .status(400)
        .json({ message: `O email ${req.body.email} já está em uso.` });
    }

    const user = await User.create(req.body);

    user.password = undefined;

    return res.status(201).json(user);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function update(req, res) {
  try {
    const { userId, body } = req;
    const { email } = body;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `Não foi encontrado usuário com o id ${userId}` });
    }

    if (email !== user.email) {
      // Checando se o email existe
      if (await User.findOne({ email })) {
        return res
          .status(400)
          .json({ message: "Email inválido, tente novamente" });
      }
    }

    const userUpdated = await User.findByIdAndUpdate(userId, body, {
      new: true,
    }).select("-password");

    return res.status(200).json(userUpdated);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function changePassword(req, res) {
  try {
    const { userId } = req;
    const { password, newPassword } = req.body;

    if (password === newPassword) {
      return res
        .status(401)
        .json({ message: "A nova senha não pode ser igual a atual" });
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const passwordsMatch = await PasswordUtils.match(password, user.password);
    if (!passwordsMatch) {
      return res.status(401).json({ message: "A senha atual está incorreta" });
    }

    user.password = newPassword;
    await user.save(); // Possui um 'pré' que faz a encriptação

    user.password = undefined;
    return res.status(200).json({ message: "Senha alterada com sucesso" });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function getAll(req, res) {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function getById(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: `Não há usuário com o id ${req.params.id}.` });
    }

    return res.status(200).json(user);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function remove(req, res) {
  try {
    const user = await User.findByIdAndRemove(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function getFavoriteInstitutionsFilteredByReligion(req, res) {
  try {
    const { id } = req.params;
    const searchName = req.query.name;

    let institutions = await Institution.aggregate([
      {
        // Filtra os documentos pelo campo 'favorited'
        $match: {
          favorited: mongoose.Types.ObjectId(id),
          name: searchName
            ? { $regex: new RegExp(searchName, "i") }
            : { $exists: true },
        },
      },
      {
        $lookup: {
          from: "religions", // O nome da coleção de religiões
          localField: "religion", // O campo da coleção 'Institution' que corresponde ao campo 'religion' da coleção 'Religion'
          foreignField: "_id", // O campo da coleção 'Religion' que corresponde ao campo '_id' da coleção 'Institution'
          as: "religionData", // O campo onde o resultado do lookup será armazenado
        },
      },
      {
        $unwind: "$religionData", // Desconstrói o array criado pelo lookup para obter um único objeto de religião
      },
      {
        $group: {
          _id: { religion: "$religionData.name", religionId: "$religion" }, // Agrupa pelos valores únicos do campo 'religion' e também pelo 'religionId'
          institutions: { $push: "$$ROOT" }, // Cria um array com os documentos correspondentes a cada grupo
        },
      },
      {
        $project: {
          _id: 0, // Exclui o campo _id do resultado final
          religion: "$_id.religion", // Extrai o campo 'religion' do '_id'
          institutions: 1, // Mantém o campo institutions no resultado final
        },
      },
      {
        $sort: {
          religion: 1, // Ordena por ordem alfabética ascendente o campo 'religion'
        },
      },
    ]);

    let referencia = {
      latitude: parseFloat(req.query.lat),
      longitude: parseFloat(req.query.lon),
    };

    institutions = institutions
      .map((group) => {
        return {
          religion: group.religion,
          institutions: group.institutions
            .filter((institution) => institution.address)
            .map((institution) => {
              const referenciaInstitution = {
                latitude: institution.address.lat,
                longitude: institution.address.long,
              };
              let distancia = haversine(referenciaInstitution, referencia);

              return {
                institution: {
                  _id: institution._id,
                  name: institution.name,
                  manager: institution.manager,
                  avatar: institution.avatar,
                  address: institution.address,
                  information: institution.information,
                  dailyEvents: institution.dailyEvents,
                  subscribed: institution.subscribed.some((item) =>
                    item._id.equals(id)
                  ), // Check if the id exists in the subscribed array
                  favorited: institution.favorited.some((item) =>
                    item._id.equals(id)
                  ), // Check if the id exists in the favorited array
                },
                distancia:
                  distancia >= 1000
                    ? (distancia / 1000).toFixed(2) + " Km"
                    : distancia.toFixed(0) + " m",
                distanceValue: distancia,
              };
            })
            .filter((institution) => parseFloat(institution.distancia) < 100000)
            .sort((a, b) => {
              const distanciaA = parseFloat(a.distanceValue);
              const distanciaB = parseFloat(b.distanceValue);
              return distanciaA - distanciaB;
            }),
        };
      })
      .filter((group) => group.institutions.length > 0);

    return res.status(200).json({ institutions });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

export default {
  create,
  update,
  remove,
  getAll,
  getById,
  changePassword,
  getFavoriteInstitutionsFilteredByReligion,
};
