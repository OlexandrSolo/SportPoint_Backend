import { model, Schema } from 'mongoose';

const userSchema = new Schema();

export const UsersCollection = model("users", userSchema);