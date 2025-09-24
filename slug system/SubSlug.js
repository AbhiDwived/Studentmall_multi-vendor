const mongoose = require('mongoose');

const SubSlugSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
        ref: 'slug',
        required: [true, "Parent Slug is Required"]
  },
  innerSubSlugs: [{
        type: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendor'
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Create compound index for unique slug per parent
SubSlugSchema.index({ slug: 1, parentSlug: 1 }, { unique: true });

module.exports = mongoose.model('subslug', SubSlugSchema); 