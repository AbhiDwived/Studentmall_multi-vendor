import { Request, Response } from 'express';
import Slug from './slug.model';
import slugify from 'slugify';

// Get all Slugs
const getAllSlugs = async (req: Request, res: Response) => {
  try {
    const slugs = await Slug.find();
    return res.json({ result: "Done", data: slugs });
  } catch (err: any) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Create new Slug
const createSlug = async (req: Request, res: Response) => {
  try {
    const { name, description, innerSlugs, status } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ result: "Fail", message: 'Name is required' });
    }

    const slug = slugify(name, { lower: true });

    const newSlug = new Slug({ 
      name, 
      slug, 
      description: description || '',
      innerSlugs: innerSlugs || [],
      status: status !== undefined ? status : true
    });
    await newSlug.save();

    return res.status(201).json({ result: "Done", data: newSlug });
  } catch (err: any) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Add Inner Slug under selected Slug
const addInnerSlug = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { innerSlugName } = req.body;

    if (!innerSlugName) {
      return res.status(400).json({ result: "Fail", message: 'Inner Slug name is required' });
    }

    const updated = await Slug.findByIdAndUpdate(
      id,
      { $push: { innerSlugs: innerSlugName } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ result: "Fail", message: 'Slug not found' });
    }

    return res.json({ result: "Done", data: updated });
  } catch (err: any) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Delete Slug
const deleteSlug = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Slug.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ result: "Fail", message: 'Slug not found' });
    }

    return res.json({ result: "Done", message: 'Slug deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Update Slug
const updateSlug = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, innerSlugs, description, status } = req.body;

    if (!name) {
      return res.status(400).json({ result: "Fail", message: 'Name is required' });
    }

    const slug = slugify(name, { lower: true });
    const updateData: any = { name, slug };
    
    if (description !== undefined) updateData.description = description;
    if (innerSlugs !== undefined) updateData.innerSlugs = innerSlugs;
    if (status !== undefined) updateData.status = status;
    
    const updated = await Slug.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ result: "Fail", message: 'Slug not found' });
    }

    return res.json({ result: "Done", data: updated });
  } catch (err: any) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

export const SlugControllers = {
  createSlug,
  getAllSlugs,
  addInnerSlug,
  updateSlug,
  deleteSlug,
};