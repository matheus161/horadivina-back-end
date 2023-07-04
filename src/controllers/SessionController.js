import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import PasswordUtils from '../utils/PasswordUtils';
import { Admin } from '../models/Admin';

async function generateToken(id) {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '60d' });
}

async function generateTokenAdmin(id) {
    return jwt.sign({ id }, process.env.SECRET_ADMIN, { expiresIn: '1d' });
}

async function auth(req, res) {
    const { email } = req.body;
    const plainTextPassword = req.body.password;

    const user = await User.findOne({ email }).select('+password');
    const passwordsMatch = await PasswordUtils.match(
        plainTextPassword,
        user?.password
    );

    if (!user || !passwordsMatch) {
        return res.status(400).json({ message: 'Email ou senha incorretos.' });
    }

    user.password = undefined;
    const token = await generateToken(user.id);

    return res.status(200).json({ user, token });
}

async function authAdmin(req, res) {
    const { email } = req.body;
    const plainTextPassword = req.body.password;

    const admin = await Admin.findOne({ email }).select('+password');
    const passwordsMatch = await PasswordUtils.match(
        plainTextPassword,
        admin?.password
    );

    if (!admin || !passwordsMatch) {
        return res.status(400).json({ message: 'Email ou senha incorretos.' });
    }

    admin.password = undefined;
    const token = await generateTokenAdmin(admin.id);

    return res.status(200).json({ admin, token });
}

async function refreshTokenUser(req, res) {
    const { token } = req.body;

    try {
        jwt.verify(token, process.env.SECRET);
        return res.status(200).json({ message: true });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(400).json({ message: false });
        }

        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default { auth, authAdmin, refreshTokenUser };
