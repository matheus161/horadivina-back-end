import { Schema, model } from 'mongoose';
import Joi from 'joi';

const ReligionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
    },

    { timeStamps: true, discriminatorKey: 'role' }
);

const Religion = model('Religion', ReligionSchema);

const religionRules = Joi.object({
    name: Joi.string()
        .pattern(new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$/))
        .required(),
    avatar: Joi.string().pattern(new RegExp(/^[A-Za-zÁÉÍÓÚáéíóúãõÃÕâêôÂÊÔ ]+$/)),
});

export { Religion, religionRules };
