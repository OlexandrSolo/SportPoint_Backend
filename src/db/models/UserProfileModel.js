import mongoose from 'mongoose';
import { handleSaveError, setupUpdateValidator } from './hooks.js';

const descriptionSchema = new mongoose.Schema({
  address: { type: String },
  short_desc: { type: String },
  abilities: { type: String },
  schedule: [{ type: Date }],
  price: { type: String },
  social_links: { type: [String] },
  phone: { type: String },
  email: { type: mongoose.Schema.Types.String, ref: 'auth' },
});

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
    name: { type: String, default: null, required: true },
    avatar: { type: String, default: null },
    images: { type: [String] },
    description: descriptionSchema,
    role: { type: mongoose.Schema.Types.String, ref: 'auth' },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userProfileSchema.post('save', handleSaveError);

userProfileSchema.pre('findOneAndUpdate', setupUpdateValidator);

userProfileSchema.post('findOneAndUpdate', handleSaveError);

export const UserProfileModel = mongoose.model(
  'user-profile',
  userProfileSchema,
);
