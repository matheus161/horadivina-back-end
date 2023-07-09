import { Institution } from "../models/Institution";

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
    } = req.body;

    const institution = await Institution.create({
      name,
      manager,
      avatar,
      address,
      information,
      dailyEvents,
      religion,
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
    const sort = req.query.sort;

    const query = {};
    if (name) {
      query.name = { $regex: `${name}.*`, $options: "i" };
    }
    if (religion) {
      query.religion = religion;
    }

    const sortField =
      sort === "1" ? { name: 1 } : { "address.lat": 1, "address.long": 1 };

    const results = query
      ? await Institution.find(query).sort(sortField)
      : await Institution.find().sort(sortField);

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

export default {
  create,
  update,
  remove,
  getAll,
  getById,
};
