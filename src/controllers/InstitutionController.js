import { Institution } from "../models/Institution";
import { User } from "../models/User";
import { Admin } from "../models/Admin";
import haversine from "haversine-distance";

async function create(req, res) {
  try {
    const {
      name,
      manager,
      avatar,
      information,
      address,
      dailyEvents,
      religion,
      pix,
      account,
    } = req.body;
    const { userId } = req;

    const institution = await Institution.create({
      name,
      manager,
      avatar,
      address,
      information,
      dailyEvents,
      religion,
      pix,
      account,
      admin: userId,
    });

    return res.status(201).json(institution);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function update(req, res) {
  try {
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return res.status(404).json({
        message: "Instituição não encontrada",
      });
    }

    const institutionUpdated = await Institution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json(institutionUpdated);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function remove(req, res) {
  try {
    const institution = await Institution.findByIdAndRemove(req.params.id);

    if (!institution) {
      return res.status(404).json({ message: "Instituição não encontrada." });
    }
    return res
      .status(200)
      .json({ message: "Instituição deletada com sucesso" });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function getAll(req, res) {
  try {
    const name = req.query.name;
    const religion = req.query.religion;

    const user = await User.findById(req.query.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const query = {};
    if (name) {
      query.name = { $regex: `${name}.*`, $options: "i" };
    }
    if (religion) {
      query.religion = religion;
    }

    let results = query
      ? await Institution.find(query)
      : await Institution.find();

    // Ordenar os resultados usando a fórmula Haversine e uma coordenada de referência
    const referencia = {
      latitude: parseFloat(req.query.lat),
      longitude: parseFloat(req.query.lon),
    };

    results.sort((a, b) => {
      const refereciaA = {
        latitude: a.address.lat,
        longitude: a.address.long,
      };
      const refereciaB = {
        latitude: b.address.lat,
        longitude: b.address.long,
      };
      const distanciaA = haversine(refereciaA, referencia);
      const distanciaB = haversine(refereciaB, referencia);

      if (distanciaA < distanciaB) {
        return -1;
      } else if (distanciaA > distanciaB) {
        return 1;
      } else {
        return 0;
      }
    });

    // Adicionando campo distancia
    results = results
      .map((institution) => {
        const referenciaInstitution = {
          latitude: institution.address.lat,
          longitude: institution.address.long,
        };
        let distancia = haversine(referenciaInstitution, referencia);

        return { ...institution._doc, distancia };
      })
      .filter((institution) => institution.distancia <= user.ratio * 1000);

    results.forEach((institution) => {
      institution.favorite = institution.favorited.includes(req.query.id)
        ? true
        : false;
      institution.subscribed = institution.subscribed.includes(req.query.id)
        ? true
        : false;
      institution.distancia =
        institution.distancia >= 1000
          ? (institution.distancia / 1000).toFixed(2) + " Km"
          : institution.distancia.toFixed(0) + " m";
    });

    // Paginação
    const page = parseInt(req.query.page) || 0;

    const pageLimit = parseInt(req.query.limit) || 5;

    const startIndex = page * pageLimit;

    const endIndex = (page + 1) * pageLimit;

    const paginatedResults = results.slice(startIndex, endIndex);

    var totalItens = results.length;

    const totalPages = Math.ceil(totalItens / pageLimit);

    return res.status(200).json({ paginatedResults, totalPages, totalItens });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function getById(req, res) {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }

    return res.status(200).json(institution);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function getInstitutionByAdmin(req, res) {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin não encontrada" });
    }
    const results = await Institution.find({ admin: req.params.id }).populate(
      "religion"
    );

    // Paginação
    const page = parseInt(req.query.page) || 0;

    const pageLimit = parseInt(req.query.limit) || 5;

    const startIndex = page * pageLimit;

    const endIndex = (page + 1) * pageLimit;

    const paginatedResults = results.slice(startIndex, endIndex);

    var totalItens = results.length;

    const totalPages = Math.ceil(totalItens / pageLimit);

    return res.status(200).json({ paginatedResults, totalPages, totalItens });
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
  getInstitutionByAdmin,
};
