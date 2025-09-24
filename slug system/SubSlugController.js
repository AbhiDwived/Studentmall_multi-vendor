const SubSlug = require('../Models/SubSlug');
const Slug = require('../Models/Slug');
const slugify = require('slugify');

// Get all SubSlugs
exports.getAllSubSlugs = async (req, res) => {
  try {
    const subSlugs = await SubSlug.find().populate('parentSlug', 'name slug');
    return res.json({ result: "Done", data: subSlugs });
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Get SubSlugs by parent Slug
exports.getSubSlugsByParent = async (req, res) => {
  try {
    const { slugId } = req.params;
    const subSlugs = await SubSlug.find({ parentSlug: slugId }).populate('parentSlug', 'name slug');
    return res.json({ result: "Done", data: subSlugs });
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Create new SubSlug
exports.createSubSlug = async (req, res) => {
  try {
    const { parentSlug, name } = req.body;
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
      slug
    });

    await newSubSlug.save();
    return res.status(201).json({ result: "Done", data: newSubSlug });
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Add Inner SubSlug
exports.addInnerSubSlug = async (req, res) => {
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
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Delete SubSlug
exports.deleteSubSlug = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SubSlug.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ result: "Fail", message: 'SubSlug not found' });
    }

    return res.json({ result: "Done", message: 'SubSlug deleted successfully' });
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
};

// Update SubSlug
exports.updateSubSlug = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentSlug, innerSubSlugs } = req.body;

    if (!name) {
      return res.status(400).json({ result: "Fail", message: 'Name is required' });
    }

    const slug = slugify(name, { lower: true });
    const updateData = { name, slug };
    
    if (parentSlug) {
      const parentExists = await Slug.findById(parentSlug);
      if (!parentExists) {
        return res.status(404).json({ result: "Fail", message: 'Parent Slug not found' });
      }
      updateData.parentSlug = parentSlug;
    }

    if (innerSubSlugs !== undefined) {
      updateData.innerSubSlugs = innerSubSlugs;
    }

    const updated = await SubSlug.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ result: "Fail", message: 'SubSlug not found' });
    }

    return res.json({ result: "Done", data: updated });
  } catch (err) {
    return res.status(500).json({ result: "Fail", message: err.message });
  }
}; 