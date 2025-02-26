import { model, Schema } from 'mongoose';
import { handleSaveError, setupUpdateValidator } from './hooks.js';

const userSchema = new Schema();

userSchema.post('save', handleSaveError);

userSchema.pre('findOneAndUpdate', setupUpdateValidator);

userSchema.post('findOneAndUpdate', handleSaveError);

export const UsersCollection = model("users", userSchema);