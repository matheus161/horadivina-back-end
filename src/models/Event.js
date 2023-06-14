import { Schema } from 'mongoose';
import Joi from 'joi';

const Event = new Schema({
    domingo: {
        type: String,
        required: false,
    },
    segunda: {
        type: String,
        required: false,
    },
    terca: {
        type: String,
        required: false,
    },
    quarta: {
        type: String,
        required: false,
    },
    quinta: {
        type: String,
        required: false,
    },
    sexta: {
        type: String,
        required: false,
    },
    sabado: {
        type: String,
        required: false,
    },
});

const eventRules = Joi.object({
    domingo: Joi.string().max(50).allow(''),
    segunda: Joi.string().max(50).allow(''),
    terca: Joi.string().max(50).allow(''),
    quarta: Joi.string().max(50).allow(''),
    quinta: Joi.string().max(50).allow(''),
    sexta: Joi.string().max(50).allow(''),
    sabado: Joi.string().max(50).allow(''),
});

export { Event, eventRules };
