import { model, Schema } from 'mongoose';
import { handleSaveError, setupUpdateValidator } from './hooks.js';

const reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    club: { type: Schema.Types.ObjectId, ref: 'clubs' }, 
    trainer: { type: Schema.Types.ObjectId, ref: 'trainers' }, 
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [{ type: String }], 
    adminReply: { type: String }, 
    reports: [{ user: { type: Schema.Types.ObjectId, ref: 'users' }, reason: String }]
}, { timestamps: true });

reviewSchema.post('save', handleSaveError);
reviewSchema.pre('findOneAndUpdate', setupUpdateValidator);
reviewSchema.post('findOneAndUpdate', handleSaveError);

export const ReviewsCollection = model('reviews', reviewSchema);
