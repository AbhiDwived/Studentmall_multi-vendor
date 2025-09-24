import { TSlug } from './slug.interface';
import Slug from './slug.model';

const createSlugIntoDB = async (payload: TSlug) => {
  const result = await Slug.create(payload);
  return result;
};

const getAllSlugsFromDB = async () => {
  const result = await Slug.find().populate('createdBy', 'name email');
  return result;
};

const getSingleSlugFromDB = async (id: string) => {
  const result = await Slug.findById(id).populate('createdBy', 'name email');
  return result;
};

const updateSlugIntoDB = async (id: string, payload: Partial<TSlug>) => {
  const result = await Slug.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSlugFromDB = async (id: string) => {
  const result = await Slug.findByIdAndDelete(id);
  return result;
};

export const SlugServices = {
  createSlugIntoDB,
  getAllSlugsFromDB,
  getSingleSlugFromDB,
  updateSlugIntoDB,
  deleteSlugFromDB,
};