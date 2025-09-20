import { TCategory } from './category.interface';
import Category from './category.model';
import { Types } from 'mongoose';

const createCategory = async (categoryData: TCategory, userId?: string) => {
	const categoryWithUser = {
		...categoryData,
		...(userId && { createdBy: new Types.ObjectId(userId) })
	};
	const category = new Category(categoryWithUser);
	await category.save();
	return category;
};

const getAllCategories = async () => {
	return await Category.find().populate('createdBy', 'name email role').sort({ name: 1 }).lean();
};

const getCategoryBySlug = async (slug: string) => {
	return await Category.findOne({ slug }).populate('createdBy', 'name email role').lean();
};

const updateCategory = async (id: string, updateData: Partial<TCategory>, userId?: string) => {
	const updateWithUser = {
		...updateData,
		...(userId && { updatedBy: new Types.ObjectId(userId) })
	};
	
	// Auto-generate slug if name is being updated
	if (updateData.name && !updateData.slug) {
		updateWithUser.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
	}
	
	return await Category.findByIdAndUpdate(id, updateWithUser, { new: true }).populate('createdBy updatedBy', 'name email role');
};

const deleteCategory = async (id: string) => {
	return await Category.findByIdAndDelete(id);
};

const getCategoryById = async (id: string) => {
	return await Category.findById(id).populate('createdBy', 'name email role').lean();
};

const getCategoriesBySeller = async (sellerId: string) => {
	return await Category.find({ createdBy: sellerId }).populate('createdBy', 'name email role').sort({ createdAt: -1 }).lean();
};

export const CategoryService = {
	createCategory,
	getAllCategories,
	getCategoryBySlug,
	getCategoryById,
	getCategoriesBySeller,
	updateCategory,
	deleteCategory,
};
