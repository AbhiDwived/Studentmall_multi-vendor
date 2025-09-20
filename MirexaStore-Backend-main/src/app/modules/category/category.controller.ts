import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.userId;
	const category = await CategoryService.createCategory(req.body, userId);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Category created successfully',
		data: category,
	});
});

const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
	const categories = await CategoryService.getAllCategories();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Categories retrieved successfully',
		data: categories,
	});
});

const getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
	const { slug } = req.params;
	const category = await CategoryService.getCategoryBySlug(slug);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Category retrieved successfully',
		data: category,
	});
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = req.user?.userId;
	const updatedCategory = await CategoryService.updateCategory(id, req.body, userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Category updated successfully',
		data: updatedCategory,
	});
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const category = await CategoryService.getCategoryById(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Category retrieved successfully',
		data: category,
	});
});

const getMyCategoriesAsSeller = catchAsync(async (req: Request, res: Response) => {
	const sellerId = req.user?.userId;
	const categories = await CategoryService.getCategoriesBySeller(sellerId!);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Seller categories retrieved successfully',
		data: categories,
	});
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const deletedCategory = await CategoryService.deleteCategory(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Category deleted successfully',
		data: deletedCategory,
	});
});

export const CategoryController = {
	createCategory,
	getAllCategories,
	getCategoryBySlug,
	getCategoryById,
	getMyCategoriesAsSeller,
	updateCategory,
	deleteCategory,
};
