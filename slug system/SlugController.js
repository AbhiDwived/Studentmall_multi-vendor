const Slug = require('../Models/Slug');
const slugify = require('slugify');

// Get all Slugs
exports.getAllSlugs = async (req, res) => {
  try {
    const slugs = await Slug.find();
    return res.json({ result: "Done", data: slugs });
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Create new Slug
exports.createSlug = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ result: "Fail", message: 'Name is required' });
    }

    const slug = slugify(name, { lower: true });

    const newSlug = new Slug({ name, slug });
    await newSlug.save();

    return res.status(201).json({ result: "Done", data: newSlug });
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Add Inner Slug under selected Slug
exports.addInnerSlug = async (req, res) => {
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
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Delete Slug
exports.deleteSlug = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Slug.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ result: "Fail", message: 'Slug not found' });
    }

    return res.json({ result: "Done", message: 'Slug deleted successfully' });
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Update Slug
exports.updateSlug = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, innerSlugs } = req.body;

    if (!name) {
      return res.status(400).json({ result: "Fail", message: 'Name is required' });
    }

    const slug = slugify(name, { lower: true });
    const updated = await Slug.findByIdAndUpdate(
      id,
      { name, slug, innerSlugs },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ result: "Fail", message: 'Slug not found' });
    }

    return res.json({ result: "Done", data: updated });
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
}; 