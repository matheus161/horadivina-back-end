import { User } from '../models/User';
import PasswordUtils from '../utils/PasswordUtils';

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
                    .json({ message: 'Email inválido, tente novamente' });
            }
        }

        const userUpdated = await User.findByIdAndUpdate(userId, body, {
            new: true,
        }).select('-password');

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
                .json({ message: 'A nova senha não pode ser igual a atual' });
        }

        const user = await User.findById(userId).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const passwordsMatch = await PasswordUtils.match(password, user.password);
        if (!passwordsMatch) {
            return res.status(401).json({ message: 'A senha atual está incorreta' });
        }

        user.password = newPassword;
        await user.save(); // Possui um 'pré' que faz a encriptação

        user.password = undefined;
        return res.status(200).json({ message: 'Senha alterada com sucesso' });
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
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        return res.status(200).json({ message: 'Usuário deletado com sucesso' });
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
};
