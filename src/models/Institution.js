import mongoose, { Schema, model } from 'mongoose';
import Joi from 'joi';
import { Address, addressRules } from './Address';
import { Event, eventRules } from './Event';

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
        dailyEvents: {
            type: Event,
            required: true,
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
    dailyEvents: eventRules.required(),
});

export { Institution, intitutionRules };
