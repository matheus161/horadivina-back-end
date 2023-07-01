import { Religion } from "../models/Religion";

async function create(req, res) {
  try {
    const { name } = req.body;
    const isReligionExists = await Religion.findOne({ name });
    if (isReligionExists) {
      return res.status(400).json({ message: `Religião já existe` });
    }

    const religion = await Religion.create(req.body);

    return res.status(201).json(religion);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function update(req, res) {
  try {
    const { name } = req.body;
    const religion = await Religion.findById(req.params.id);

    if (!religion) {
      return res.status(404).json({
        message: `Religião não encontrada`,
      });
    }

    if (name != religion.name) {
      if (await Religion.findOne({ name })) {
        return res.status(400).json({ message: "Religião já existe" });
      }
    }

    const religionUpdate = await Religion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json(religionUpdate);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function getAll(req, res) {
  try {
    const { name } = req.body;
    let results = name
      ? await Religion.find({
          name: { $regex: `${name}.*`, $options: "i" },
        }).sort({ name: 1 })
      : await Religion.find({}).sort({ name: 1 });

    return res.status(200).json(results);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function remove(req, res) {
  try {
    const religion = await Religion.findByIdAndRemove(req.params.id);

    if (!religion) {
      return res.status(404).json({ message: "Religião não encontrada." });
    }

    return res.status(200).json({ message: "Religião deletada com sucesso" });
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
