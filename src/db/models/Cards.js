import { mongoose, model } from "mongoose";

import { typeList } from '../../constants/clubTrainerList.js';

import { handleSaveError, setupUpdateValidator } from './hooks.js';

const ClubTrainerSchema = new mongoose.Schema({
    profileImage: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    contacts: {
        phone: { type: String, require: true },
        email: { type: String, require: true },
        social: {
            instagram: { type: String, default: "" },
            facebook: { type: String, default: "" },
            x: { type: String, default: "" },
        }
    },
    address: {
        type: String,
    },
    description: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: [...typeList],
        required: true
    }
},
    {
        timestamps: true,
        versionKey: false
    });

// Валідація перед збереженням
ClubTrainerSchema.post("save", handleSaveError);

ClubTrainerSchema.pre("findOneAndUpdate", setupUpdateValidator);

ClubTrainerSchema.post("findOneAndUpdate", handleSaveError);

const CardCollection = model("cards", ClubTrainerSchema);

export default CardCollection;