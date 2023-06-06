import mongoose, { Schema, model } from "mongoose";
import Joi from "joi";

const NewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
      require: true,
    },

    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
  },
  { timeStamps: true, discriminatorKey: "role" }
);

const News = model("News", NewsSchema);

const newsRules = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  institution: Joi.string().required(),
});

export { News, newsRules };
