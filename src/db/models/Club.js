import { model, Schema } from 'mongoose';

const clubSchema = new Schema();

export const ClubsCollection = model("clubs", clubSchema);