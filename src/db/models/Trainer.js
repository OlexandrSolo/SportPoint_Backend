import { model, Schema } from 'mongoose';
import { handleSaveError, setupUpdateValidator } from './hooks.js';

const trainerSchema = new Schema();

trainerSchema.post('save', handleSaveError);

trainerSchema.pre('findOneAndUpdate', setupUpdateValidator);

trainerSchema.post('findOneAndUpdate', handleSaveError);


export const TrainersCollection = model("trainers", trainerSchema);