import mongoose, { Schema, model } from 'mongoose';
import Joi from 'joi';
import { Address, addressRules } from './Address';

const InstitutionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: Address,
            required: true,
        },
        information: {
            type: String,
            required: false,
        },
        events: {
            type: String,
            required: false,
        },
        subscribed: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: false,
            },
        ],
    },
    { timeStamps: true, discriminatorKey: 'role' }
);

const Institution = model('Institution', InstitutionSchema);

const intitutionRules = Joi.object({
    name: Joi.string().max(100).required(),
    address: addressRules.required(),
    information: Joi.string().max(100),
    events: Joi.string().max(100),
});

export { Institution, intitutionRules };
