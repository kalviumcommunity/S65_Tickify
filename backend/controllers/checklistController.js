const Checklist = require("../models/ChecklistModel"); // Import Model

// Get all checklist items
const getChecklistItems = async (req, res) => {
  try {
    const items = await Checklist.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch checklist items", error: error.message });
  }
};

// Add a new checklist item
const addChecklistItem = async (req, res) => {
  try {
    const { text, completed, priority } = req.body;

    // Validation: Ensure text is provided
    if (!text) {
      return res.status(400).json({ message: "Text field is required!" });
    }

    const newItem = new Checklist({ 
      text, 
      completed: completed ?? false,  // Default: false
      priority: priority ?? "low",   // Default: "low"
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add checklist item", error: error.message });
  }
};

//  Update checklist item
const updateChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const item = await Checklist.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Checklist item not found" });
    }

    const updatedItem = await Checklist.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update checklist item", error: error.message });
  }
};

//  Delete checklist item
const deleteChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const item = await Checklist.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Checklist item not found" });
    }

    await Checklist.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete checklist item", error: error.message });
  }
};

//  Export all controllers
module.exports = {
  getChecklistItems,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
};
