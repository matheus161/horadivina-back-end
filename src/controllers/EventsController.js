import { Institution } from "../models/Institution";
import { Events } from "../models/Events";

async function create(req, res) {
  try {
    const institution = await Institution.findById(req.body.institution);
    if (!institution) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }
    req.body.admin = req.userId;
    const events = await Events.create(req.body);

    // TODO: Disparar notificação via email ou apenas notificação mobile

    return res.status(201).json(events);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function update(req, res) {
  try {
    const events = await Events.findById(req.params.id);

    if (!events) {
      return res.status(404).json({
        message: `Evento não encontrado`,
      });
    }

    const eventsUpdated = await Events.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    return res.status(200).json(eventsUpdated);
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

    const events = await Events.find({
      institution: id,
    }).sort({ _id: -1 });

    const page = parseInt(req.query.page) || 0;

    const limit = 5;

    const startIndex = page * limit;

    const endIndex = (page + 1) * limit;

    const paginatedResults = events.slice(startIndex, endIndex);

    var totalitens = events.length;

    return res.status(200).json({ paginatedResults, totalitens });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function remove(req, res) {
  try {
    const events = await Events.findByIdAndRemove(req.params.id);

    if (!events) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    return res.status(200).json({ message: "Evento deletado com sucesso" });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

export default {
  create,
  update,
  getAll,
  remove,
};
