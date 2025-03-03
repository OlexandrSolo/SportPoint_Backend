import mongoose from 'mongoose';
import { handleSaveError, setupUpdateValidator } from './hooks.js';

const socialLinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const pricesSchema = new mongoose.Schema({
  name: { type: String },
  amount: { type: String, required: true },
});

const schedulesSchema = new mongoose.Schema({
  days: { type: String },
  hours: {
    type: String,
  },
  date: { type: Date },
});

//TODO change if you need
const favoriteSchema = new mongoose.Schema({
  type: { type: String },
});

const descriptionSchema = new mongoose.Schema({
  address: { type: String },
  short_desc: { type: String },
  abilities: { type: String },
  schedule: { type: [schedulesSchema] },
  equipment: { type: [String] },
  experience: { type: [Date] },
  price: { type: [pricesSchema] },
  social_links: { type: [socialLinkSchema] },
  phone: { type: String },
  email: { type: mongoose.Schema.Types.String, ref: 'auth' },
});

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
    firstLastName: { type: String, default: null },
    avatar: { type: String },
    images: { type: [String] },
    certificates: { type: [String] },
    description: descriptionSchema,
    role: { type: mongoose.Schema.Types.String, ref: 'auth' },
    favorite: { type: [favoriteSchema] },
    club: { type: [String] },
    couch: { type: [String], default: [] },
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
