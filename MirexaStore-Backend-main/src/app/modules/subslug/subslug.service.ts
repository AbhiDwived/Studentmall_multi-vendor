import { TSubSlug } from './subslug.interface';
import SubSlug from './subslug.model';

const createSubSlugIntoDB = async (payload: TSubSlug) => {
  const result = await SubSlug.create(payload);
  return result;
};

const getAllSubSlugsFromDB = async () => {
  const result = await SubSlug.find()
    .populate('parentSlug', 'name slug')
    .populate('createdBy', 'name email');
  return result;
};

const getSubSlugsByParentFromDB = async (parentSlugId: string) => {
  const result = await SubSlug.find({ parentSlug: parentSlugId })
    .populate('parentSlug', 'name slug')
    .populate('createdBy', 'name email');
  return result;
};

const getSingleSubSlugFromDB = async (id: string) => {
  const result = await SubSlug.findById(id)
    .populate('parentSlug', 'name slug')
    .populate('createdBy', 'name email');
  return result;
};

const updateSubSlugIntoDB = async (id: string, payload: Partial<TSubSlug>) => {
  const result = await SubSlug.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSubSlugFromDB = async (id: string) => {
  const result = await SubSlug.findByIdAndDelete(id);
  return result;
};

export const SubSlugServices = {
  createSubSlugIntoDB,
  getAllSubSlugsFromDB,
  getSubSlugsByParentFromDB,
  getSingleSubSlugFromDB,
  updateSubSlugIntoDB,
  deleteSubSlugFromDB,
};