const Checklist = require("../models/ChecklistModel");
const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Get all checklist items
const getChecklistItems = async (req, res) => {
  try {
    const items = await Checklist.find().populate("created_by", "email");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch checklist items", error: error.message });
  }
};

// Get checklist items by user
const getChecklistItemsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const items = await Checklist.find({ created_by: userId }).populate("created_by", "email");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch checklist items", error: error.message });
  }
};

// Add a new checklist item
const addChecklistItem = async (req, res) => {
  try {
    const { text, completed, priority, created_by } = req.body;

    // Validation: Ensure text is provided
    if (!text) {
      return res.status(400).json({ message: "Text field is required!" });
    }

    // Validation: Ensure user exists
    const user = await User.findById(created_by);
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const newItem = new Checklist({
      text,
      completed: completed ?? false, // Default: false
      priority: priority ?? "low", // Default: "low"
      created_by,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add checklist item", error: error.message });
  }
};

// Update checklist item
const updateChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed, priority } = req.body;

    // Check if item exists
    const item = await Checklist.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Checklist item not found" });
    }

    // Update only allowed fields
    if (text) item.text = text;
    if (completed !== undefined) item.completed = completed;
    if (priority) item.priority = priority;

    await item.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to update checklist item", error: error.message });
  }
};

// Delete checklist item
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

// Validation middleware
const validateChecklist = [
  body("text").optional().isString().withMessage("Text must be a string"),
  body("completed").optional().isBoolean().withMessage("Completed must be a boolean"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Priority must be 'low', 'medium', or 'high'"),
  body("created_by").optional().isMongoId().withMessage("Invalid user ID format"),
];

module.exports = {
  getChecklistItems,
  getChecklistItemsByUser,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  validateChecklist,
};