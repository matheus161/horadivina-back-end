import { Schema } from "mongoose";
import Joi from "joi";

const BankAccount = new Schema({
  bankName: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
  },
  agency: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: false,
  },
});

const bankAccountRules = Joi.object({
  bankName: Joi.string().max(50).required(),
  accountType: Joi.string().max(20).required(),
  agency: Joi.string().max(20).required(),
  accountNumber: Joi.string().max(50).required(),
  owner: Joi.string().max(50).required(),
});

export { BankAccount, bankAccountRules };
