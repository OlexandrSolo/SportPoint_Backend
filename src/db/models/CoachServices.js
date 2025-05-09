import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const CoachServices = Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'auth' },
    name: { type: String },
    description: { type: String },
    amount: { type: Number, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const CoachServicesCollection = model('coach_services', CoachServices);

export default CoachServicesCollection;
