import { model, Schema } from 'mongoose';
import { handleSaveError, setupUpdateValidator } from './hooks.js';

const reportsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'auth' },
    reason: { type: String, default: '' }, 
    
}, { 
    timestamps: true,
    versionKey: false 
});


const reviewSchema = new Schema({

    // user: { type: Schema.Types.ObjectId, ref: 'auth', require: true },
    owner: { type: Schema.Types.ObjectId, ref: 'auth', require: true },
    userCommentId: { type: Schema.Types.ObjectId, ref: 'auth' }, 
    // club: { type: Schema.Types.ObjectId, ref: 'auth' }, 
    // trainer: { type: Schema.Types.ObjectId,  ref: 'auth'}, 
    ratings: {
        clientService: { type: Number, required: true, min: 1, max: 5 },
        serviceQuality: { type: Number, required: true, min: 1, max: 5 },
        priceQuality: { type: Number, required: true, min: 1, max: 5 },
        location: { type: Number, required: true, min: 1, max: 5 },
        cleanliness: { type: Number, required: true, min: 1, max: 5 }
    },
    average: { type: Number, min: 0, max: 5, default: 0 },
    comment: { type: String, required: true, minlength: 20, maxlength: 500 },
    // images: { type: String }, 
    adminReply: { type: String, default: '' }, 
    reports: [reportsSchema],
}, { 
    timestamps: true,
    versionKey: false 
});

reviewSchema.post('save', handleSaveError);
reviewSchema.pre('findOneAndUpdate', setupUpdateValidator);
reviewSchema.post('findOneAndUpdate', handleSaveError);

export const ReviewsCollection = model('reviews', reviewSchema);
