import { TrainersCollection } from "../db/models/Trainer.js";

export const getAllTrainers = async () => {
    const trainers = await TrainersCollection.find();
    return trainers;
};