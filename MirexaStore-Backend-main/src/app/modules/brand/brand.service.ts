import { TBrand } from './brand.interface';
import Brand from './brand.model';
import { Types } from 'mongoose';

const createBrand = async (brandData: TBrand, userId?: string) => {
	const brandWithUser = {
		...brandData,
		...(userId && { createdBy: new Types.ObjectId(userId) })
	};
	const brand = new Brand(brandWithUser);
	await brand.save();
	return brand;
};

const getAllBrands = async () => {
	return await Brand.find().populate('createdBy', 'name email role').sort({ name: 1 }).lean();
};

const getBrandBySlug = async (slug: string) => {
	return await Brand.findOne({ slug }).populate('createdBy', 'name email role').lean();
};

const getBrandById = async (id: string) => {
	return await Brand.findById(id).populate('createdBy', 'name email role').lean();
};

const getBrandsBySeller = async (sellerId: string) => {
	return await Brand.find({ createdBy: sellerId }).populate('createdBy', 'name email role').sort({ createdAt: -1 }).lean();
};

const updateBrand = async (id: string, updateData: Partial<TBrand>, userId?: string) => {
	const updateWithUser = {
		...updateData,
		...(userId && { updatedBy: new Types.ObjectId(userId) })
	};
	
	if (updateData.name && !updateData.slug) {
		updateWithUser.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
	}
	
	return await Brand.findByIdAndUpdate(id, updateWithUser, { new: true }).populate('createdBy updatedBy', 'name email role');
};

const deleteBrand = async (id: string) => {
	return await Brand.findByIdAndDelete(id);
};

export const BrandService = {
	createBrand,
	getAllBrands,
	getBrandBySlug,
	getBrandById,
	getBrandsBySeller,
	updateBrand,
	deleteBrand,
};