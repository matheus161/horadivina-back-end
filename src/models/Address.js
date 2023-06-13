import { Schema } from 'mongoose';
import Joi from 'joi';

const Address = new Schema({
    cep: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
});

const addressRules = Joi.object({
    cep: Joi.string()
        .pattern(new RegExp(/^\d{5}-\d{3}$/))
        .required(),
    street: Joi.string().max(50).required(),
    city: Joi.string().max(50).required(),
    state: Joi.string().max(50).required(),
    country: Joi.string().max(50).required(),
    number: Joi.number().integer().positive().required(),
});

export { Address, addressRules };
