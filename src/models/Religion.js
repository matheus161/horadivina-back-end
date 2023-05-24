import { Schema, model } from "mongoose";
import Joi from "joi";

const ReligionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    resume: {
      type: String,
    },
  },

  { timeStamps: true, discriminatorKey: "role" }
);

const Religion = model("Religion", ReligionSchema);

const religionRules = Joi.object({
  name: Joi.string()
    .pattern(new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$/))
    .required(),
  origin: Joi.string().pattern(new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$/)),
  description: Joi.string().pattern(
    new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$/)
  ),
  resume: Joi.string().pattern(new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$/)),
});

export { Religion, religionRules };
