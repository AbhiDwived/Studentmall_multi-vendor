const mongoose = require('mongoose');

const SlugSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendor'
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('slug', SlugSchema); 