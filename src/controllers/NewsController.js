import { News } from '../models/News';

async function create(req, res) {
    try {
    // req.body.date = new Date();
        const news = await News.create(req.body);

        return res.status(201).json(news);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function getAll(req, res) {
    try {
        const news = await News.find();
        return res.status(200).json(news);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function getById(req, res) {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'Notícia não encontrada' });
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
            return res.status(404).json({ message: 'Notícia não encontrada.' });
        }

        return res.status(200).json({ message: 'Notícia deletada com sucesso' });
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
