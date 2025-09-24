import { Schema, model } from 'mongoose';
import { TSubSlug } from './subslug.interface';

const SubSlugSchema = new Schema<TSubSlug>({
  name: {
    type: String,
    required: [true, "Name is Required"]
  },
  slug: {
    type: String,
    required: [true, "Slug is Required"]
  },
  description: {
    type: String
  },
  parentSlug: {
    type: Schema.Types.ObjectId,
    ref: 'Slug',
    required: [true, "Parent Slug is Required"]
  },
  innerSubSlugs: [{
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

// Create compound index for unique slug per parent
SubSlugSchema.index({ slug: 1, parentSlug: 1 }, { unique: true });

export default model<TSubSlug>('SubSlug', SubSlugSchema);