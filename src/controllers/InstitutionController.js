import { Institution } from '../models/Institution';

async function create(req, res) {
    try {
        const {
            name, information, address, dailyEvents
        } = req.body;

        const institution = await Institution.create({
            name,
            address,
            information,
            dailyEvents,
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
                message: 'Instituição não encontrada',
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
            return res.status(404).json({ message: 'Instituição não encontrada.' });
        }

        return res
            .status(200)
            .json({ message: 'Instituição deletada com sucesso' });
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function getAll(req, res) {
    try {
        const institutions = await Institution.find();
        return res.status(200).json(institutions);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function getById(req, res) {
    try {
        const institution = await Institution.findById(req.params.id);
        if (!institution) {
            return res.status(404).json({ message: 'Instituição não encontrada' });
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
