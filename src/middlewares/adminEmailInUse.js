import { Admin } from "../models/Admin";

async function adminEmailInUse(req, res, next) {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    req.adminEmailInUse = admin !== null;
    return next();
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

export default adminEmailInUse;
