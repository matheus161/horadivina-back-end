import mongoose, { Schema, model } from "mongoose";
import Joi from "joi";
import { Address, addressRules } from "./Address";
import { Event, eventRules } from "./Event";
import { ContactDetails, contactDetailsRules } from "./ContactDetails";

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
  },
  { timeStamps: true, discriminatorKey: "role" }
);

const Institution = model("Institution", InstitutionSchema);

const intitutionRules = Joi.object({
  name: Joi.string().max(100).required(),
  manager: Joi.string().max(100).required(),
  avatar: Joi.string(),
  address: addressRules.required(),
  information: contactDetailsRules.required(),
  dailyEvents: eventRules.required(),
  religion: Joi.array().required(),
});

export { Institution, intitutionRules };
