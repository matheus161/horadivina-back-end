import { Schema } from "mongoose";
import Joi from "joi";

const Pix = new Schema({
  owner: {
    type: String,
    required: false,
  },
  bankName: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
});

const pixRules = Joi.object({
  owner: Joi.string().max(50).required(),
  bankName: Joi.string().max(20).required(),
  key: Joi.string().max(50).required(),
});

export { Pix, pixRules };
