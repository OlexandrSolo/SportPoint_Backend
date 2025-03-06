import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const authSchema = Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'coach', 'adminClub'],
      default: 'customer',
    },

    token: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
      //щоб в базі не світлось як null
      required: true
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
    verifyCode: {
      type: Number,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

const Auth = model('auth', authSchema);

export default Auth;
