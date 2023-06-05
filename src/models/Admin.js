import mongoose, { Schema, model } from "mongoose";
import Joi from "joi";
import PasswordUtils from "../utils/PasswordUtils";

const AdminSchema = new Schema(
  {
    cnpj: {
      type: String,
      required: false,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 40,
      select: false,
    },

    institutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        required: false,
      },
    ],
  },
  { timeStamps: true, discriminatorKey: "role" }
);

AdminSchema.pre("save", async function (next) {
  this.password = await PasswordUtils.encrypt(this.password);
  next();
});

const Admin = model("Admin", AdminSchema);

const emailRules = Joi.string().email().required();
const passwordRules = Joi.string().min(8).max(40).required();

const adminRules = Joi.object({
  cnpj: Joi.string().pattern(/^[0-9]{14}$/),
  name: Joi.string()
    .pattern(new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$/))
    .required(),
  email: emailRules,
  password: passwordRules,
  institutions: Joi.array(),
});

const adminAuthRules = Joi.object({
  email: emailRules,
  password: passwordRules,
});

export { Admin, adminRules, adminAuthRules };
