import { Schema, model } from 'mongoose';
import { TBrand } from './brand.interface';
import slugify from 'slugify';

const brandSchema = new Schema<TBrand>(
	{
		name: { type: String, required: true, unique: true, trim: true },
		slug: { type: String, required: true, unique: true, lowercase: true },
		logo: { type: String },
		description: { type: String },
		status: { type: String, enum: ['active', 'inactive'], default: 'active' },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
		updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
	},
	{ timestamps: true }
);

brandSchema.pre('validate', function (next) {
	if (this.name) {
		const slugifiedName = slugify(this.name, { lower: true, remove: /[^\w\s-]/g });
		this.slug = slugifiedName.slice(0, 60);
	}
	next();
});

const Brand = model<TBrand>('Brand', brandSchema);

export default Brand;