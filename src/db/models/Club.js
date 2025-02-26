import { model, Schema } from 'mongoose';
import { handleSaveError, setupUpdateValidator } from './hooks.js';

const clubSchema = new Schema();

clubSchema.post('save', handleSaveError);

clubSchema.pre('findOneAndUpdate', setupUpdateValidator);

clubSchema.post('findOneAndUpdate', handleSaveError);

export const ClubsCollection = model("clubs", clubSchema);