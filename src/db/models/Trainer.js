import { model, Schema } from 'mongoose';

const trainerSchema = new Schema();

export const TrainersCollection = model("trainers", trainerSchema);