import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BrandService } from './brand.service';

const createBrand = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.userId;
	const brand = await BrandService.createBrand(req.body, userId);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Brand created successfully',
		data: brand,
	});
});

const getAllBrands = catchAsync(async (_req: Request, res: Response) => {
	const brands = await BrandService.getAllBrands();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Brands retrieved successfully',
		data: brands,
	});
});

const getBrandBySlug = catchAsync(async (req: Request, res: Response) => {
	const { slug } = req.params;
	const brand = await BrandService.getBrandBySlug(slug);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Brand retrieved successfully',
		data: brand,
	});
});

const getBrandById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const brand = await BrandService.getBrandById(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Brand retrieved successfully',
		data: brand,
	});
});

const getMyBrandsAsSeller = catchAsync(async (req: Request, res: Response) => {
	const sellerId = req.user?.userId;
	const brands = await BrandService.getBrandsBySeller(sellerId!);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Seller brands retrieved successfully',
		data: brands,
	});
});

const updateBrand = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = req.user?.userId;
	const updatedBrand = await BrandService.updateBrand(id, req.body, userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Brand updated successfully',
		data: updatedBrand,
	});
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const deletedBrand = await BrandService.deleteBrand(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Brand deleted successfully',
		data: deletedBrand,
	});
});

export const BrandController = {
	createBrand,
	getAllBrands,
	getBrandBySlug,
	getBrandById,
	getMyBrandsAsSeller,
	updateBrand,
	deleteBrand,
};