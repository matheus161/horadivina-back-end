import { Institution } from '../models/Institution';
import { User } from '../models/User';

async function subscribe(req, res) {
    try {
        const { userId } = req;
        const { id } = req.params;

        // Checando se os usuários passados são válidos
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const institution = await Institution.findById(id);
        if (!institution) {
            return res.status(404).json({ message: 'Instituição não encontrada' });
        }

        if (institution.subscribed.includes(userId)) {
            return res
                .status(400)
                .json({ message: `${institution.name} já está nos seus favoritos` });
        }

        const arrSubscribedFromInstitution = institution.subscribed;
        arrSubscribedFromInstitution.push(userId);

        await institution.updateOne({
            subscribed: arrSubscribedFromInstitution || institution.subscribed,
        });

        return res
            .status(200)
            .json({ message: `${institution.name} adicionado(a) aos favoritos` });
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function unsubscribe(req, res) {
    try {
        const { userId } = req;
        const { id } = req.params;

        // Checando se os usuários passados são válidos
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const institution = await Institution.findById(id);
        if (!institution) {
            return res.status(404).json({ message: 'Instituição não encontrada' });
        }

        if (!institution.subscribed.includes(userId)) {
            return res.status(400).json({
                message: `${institution.name} não pode ser removido(a) por não estar em sua lista de favoritos`,
            });
        }

        let arr = [];
        if (institution.subscribed.length === 1) {
            institution.subscribed = [];
        } else {
            arr = institution.subscribed.filter((item) => !item.equals(userId));
        }

        await institution.updateOne({
            subscribed: arr || institution.subscribed,
        });

        return res
            .status(200)
            .json({ message: `${institution.name} removido(a) dos favoritos` });
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

// Function that check if the user is subscribed ins the institution
async function isSubscribed(req, res) {
    try {
        const { userId } = req;
        const { id } = req.params;

        // Checando se os usuários passados são válidos
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const institution = await Institution.findById(id);
        if (!institution) {
            return res.status(404).json({ message: 'Instituição não encontrada' });
        }

        if (institution.subscribed.includes(userId)) {
            return res.status(200).json({ success: true });
        }

        return res.status(200).json({ success: false });
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

export default {
    subscribe,
    unsubscribe,
    isSubscribed,
};
