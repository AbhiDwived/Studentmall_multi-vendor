import { Schema, model } from 'mongoose';
import { TSlug } from './slug.interface';

const SlugSchema = new Schema<TSlug>({
    name: {
        type: String,
        required: [true, "Name is Required"],
        unique: true
    },
    slug: {
        type: String,
        required: [true, "Slug is Required"],
        unique: true
    },
    description: {
        type: String
    },
    innerSlugs: [{
        type: String
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default model<TSlug>('Slug', SlugSchema);