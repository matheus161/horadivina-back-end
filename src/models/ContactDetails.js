import { Schema } from 'mongoose';
import Joi from 'joi';

const ContactDetails = new Schema({
    number: {
        type: String,
        required: false,
    },
    whatsapp: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    website: {
        type: String,
    },
    instagram: {
        type: String,
        required: false,
    },
    facebook: {
        type: String,
        required: false,
    },
});

const contactDetailsRules = Joi.object({
    number: Joi.string().max(25).allow(''),
    whatsapp: Joi.string().max(25).allow(''),
    email: Joi.string().email().allow(''),
    website: Joi.string().max(50).allow(''),
    instagram: Joi.string().max(50).allow(''),
    facebook: Joi.string().max(50).allow(''),
});

export { ContactDetails, contactDetailsRules };
