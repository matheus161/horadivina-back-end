import { Institution } from "../models/Institution";
import { News } from "../models/News";

async function create(req, res) {
  try {
    const institution = await Institution.findById(req.body.institution);
    if (!institution) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }
    req.body.admin = req.userId;
    const news = await News.create(req.body);

    // TODO: Disparar notificação via email ou apenas notificação mobile

    return res.status(201).json(news);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function getAll(req, res) {
  try {
    const { id } = req.params;
    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }

    const news = await News.find({
      institution: id,
    }).populate("institution");

    const page = parseInt(req.query.page) || 0;

    const limit = 5;

    const startIndex = page * limit;

    const endIndex = (page + 1) * limit;

    const paginatedResults = news.slice(startIndex, endIndex);

    var totalitens = news.length;

    return res.status(200).json({ paginatedResults, totalitens });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function getById(req, res) {
  try {
    const news = await News.findById(req.params.id).populate("institution");
    if (!news) {
      return res.status(404).json({ message: "Notícia não encontrada" });
    }

    return res.status(200).json(news);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function remove(req, res) {
  try {
    const news = await News.findByIdAndRemove(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "Notícia não encontrada." });
    }

    return res.status(200).json({ message: "Notícia deletada com sucesso" });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

export default {
  create,
  getAll,
  getById,
  remove,
};
