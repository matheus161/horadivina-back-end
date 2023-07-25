import { Admin } from "../models/Admin";

async function create(req, res) {
  try {
    if (req.adminEmailInUse) {
      return res
        .status(400)
        .json({ message: `O email ${req.body.email} já está em uso.` });
    }

    const admin = await Admin.create(req.body);

    admin.password = undefined;

    return res.status(201).json(admin);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function getAll(req, res) {
  try {
    const admins = await Admin.find().populate("institutions");
    return res.status(200).json(admins);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function getById(req, res) {
  try {
    const admin = await Admin.findById(req.params.id).populate("institutions");

    if (!admin) {
      return res
        .status(404)
        .json({ message: `Não há usuário com o id ${req.params.id}.` });
    }

    return res.status(200).json(admin);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function update(req, res) {
  try {
    const { userId, body } = req;
    const admin = await Admin.findById(userId);

    if (!admin) {
      return res.status(404).json({
        message: "Admin não encontrado",
      });
    }

    if (admin.email !== body.email) {
      if (req.adminEmailInUse) {
        return res
          .status(400)
          .json({ message: `O email ${req.body.email} já está em uso.` });
      }
    }

    // for (let index = 0; index < admin.institutions.length - 1; index++) {
    //   const item = admin.institutions[index];
    //   if (!(await Institution.findById(item))) {
    //     return res.status(404).json({ message: "Instituição não encontrada" });
    //   }

    //   if (await admin.institutions.includes(item)) {
    //     return res
    //       .status(400)
    //       .json({ message: "Instituição já está nos seus favoritos" });
    //   }
    // }

    const adminUpdated = await Admin.findByIdAndUpdate(userId, body, {
      new: true,
    });

    return res.status(200).json(adminUpdated);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function remove(req, res) {
  try {
    const admin = await Admin.findByIdAndRemove(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin não encontrado." });
    }

    return res.status(200).json({ message: "Admin deletado com sucesso" });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

export default {
  create,
  getAll,
  getById,
  update,
  remove,
};
