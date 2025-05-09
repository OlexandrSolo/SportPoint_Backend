import mongoose from 'mongoose';
import { handleSaveError, setupUpdateValidator } from './hooks.js';

const socialLinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const pricesSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  amount: { type: Number, required: true },
  image: { type: String },
});

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
  role: { type: mongoose.Schema.Types.String, ref: 'auth' },
});

const workSchema = new mongoose.Schema({
  id: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  city: { type: String },
});

const descriptionSchema = new mongoose.Schema({
  address: { type: String },
  city: { type: String },
  short_desc: { type: String },
  abilities: { type: [String] },
  age: { type: String },
  schedule: {},
  equipment: { type: [String] },
  experience: { type: Number },
  subscriptions: { type: [pricesSchema] },
  social_links: { type: [socialLinkSchema] },
  phone: { type: String },
  email: { type: mongoose.Schema.Types.String, ref: 'auth' },
});

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
    countReview: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    avatar: { type: String },
    images: { type: [String] },
    certificates: { type: [String] },
    description: descriptionSchema,
    role: { type: mongoose.Schema.Types.String, ref: 'auth' },
    favorite: { type: [favoriteSchema] },
    club: { type: [workSchema] },
    coach: { type: [workSchema] },
    sport: { type: [String] },
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
