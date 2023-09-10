import mongoose, { Schema, model } from "mongoose";
import Joi from "joi";
import { Address, addressRules } from "./Address";
import { Event, eventRules } from "./Event";
import { ContactDetails, contactDetailsRules } from "./ContactDetails";
import { Pix, pixRules } from "./Pix";
import { BankAccount, bankAccountRules } from "./BankAccount";

const InstitutionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    manager: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    pix: {
      type: Pix,
      required: true,
    },
    account: {
      type: BankAccount,
      required: true,
    },
    address: {
      type: Address,
      required: true,
    },
    information: {
      type: ContactDetails,
      required: false,
    },
    dailyEvents: {
      type: Event,
      required: true,
    },
    subscribed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    favorited: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    religion: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Religion",
        required: true,
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
  },
  { timeStamps: true, discriminatorKey: "role" }
);

const Institution = model("Institution", InstitutionSchema);

const intitutionRules = Joi.object({
  name: Joi.string().max(100).required(),
  manager: Joi.string().max(100).required(),
  avatar: Joi.string(),
  pix: pixRules.required(),
  account: bankAccountRules.required(),
  address: addressRules.required(),
  information: contactDetailsRules.required(),
  dailyEvents: eventRules.required(),
  religion: Joi.array().required(),
});

export { Institution, intitutionRules };
