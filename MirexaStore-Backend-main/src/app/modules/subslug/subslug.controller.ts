import { Request, Response } from 'express';
import SubSlug from './subslug.model';
import Slug from '../slug/slug.model';
import slugify from 'slugify';

// Get all SubSlugs
const getAllSubSlugs = async (req: Request, res: Response) => {
  try {
    const subSlugs = await SubSlug.find().populate('parentSlug', 'name slug');
    return res.json({ result: "Done", data: subSlugs });
  } catch (err: any) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Get SubSlugs by parent Slug
const getSubSlugsByParent = async (req: Request, res: Response) => {
  try {
    const { slugId } = req.params;
    const subSlugs = await SubSlug.find({ parentSlug: slugId }).populate('parentSlug', 'name slug');
    return res.json({ result: "Done", data: subSlugs });
  } catch (err: any) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Create new SubSlug
const createSubSlug = async (req: Request, res: Response) => {
  try {
    const { parentSlug, name, description, innerSubSlugs, status } = req.body;
    console.log("Received payload for createSubSlug:", req.body);

    if (!parentSlug || !name) {
      return res.status(400).json({ result: "Fail", message: 'Parent Slug and Name are required' });
    }

    const parentExists = await Slug.findById(parentSlug);
    if (!parentExists) {
      return res.status(404).json({ result: "Fail", message: 'Parent Slug not found' });
    }

    let slug = slugify(name, { lower: true });
    let counter = 1;
    
    // Check for existing slug with same parent and generate unique one if needed
    while (await SubSlug.findOne({ slug, parentSlug })) {
      slug = slugify(name, { lower: true }) + '-' + counter;
      counter++;
    }

    const newSubSlug = new SubSlug({
      parentSlug,
      name,
      slug,
      description: description || '',
      innerSubSlugs: innerSubSlugs || [],
      status: status !== undefined ? status : true
    });

    await newSubSlug.save();
    return res.status(201).json({ result: "Done", data: newSubSlug });
  } catch (err: any) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Add Inner SubSlug
const addInnerSubSlug = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { innerSubSlugName } = req.body;

    if (!innerSubSlugName) {
      return res.status(400).json({ result: "Fail", message: 'Inner SubSlug name is required' });
    }

    const updated = await SubSlug.findByIdAndUpdate(
      id,
      { $push: { innerSubSlugs: innerSubSlugName } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ result: "Fail", message: 'SubSlug not found' });
    }

    return res.json({ result: "Done", data: updated });
  } catch (err: any) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Delete SubSlug
const deleteSubSlug = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await SubSlug.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ result: "Fail", message: 'SubSlug not found' });
    }

    return res.json({ result: "Done", message: 'SubSlug deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Update SubSlug
const updateSubSlug = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, parentSlug, innerSubSlugs, description, status } = req.body;

    if (!name) {
      return res.status(400).json({ result: "Fail", message: 'Name is required' });
    }

    const slug = slugify(name, { lower: true });
    const updateData: any = { name, slug };
    
    if (parentSlug) {
      const parentExists = await Slug.findById(parentSlug);
      if (!parentExists) {
        return res.status(404).json({ result: "Fail", message: 'Parent Slug not found' });
      }
      updateData.parentSlug = parentSlug;
    }

    if (description !== undefined) updateData.description = description;
    if (innerSubSlugs !== undefined) updateData.innerSubSlugs = innerSubSlugs;
    if (status !== undefined) updateData.status = status;

    const updated = await SubSlug.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ result: "Fail", message: 'SubSlug not found' });
    }

    return res.json({ result: "Done", data: updated });
  } catch (err: any) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

export const SubSlugControllers = {
  createSubSlug,
  getAllSubSlugs,
  getSubSlugsByParent,
  addInnerSubSlug,
  updateSubSlug,
  deleteSubSlug,
};