const express = require("express");
const {
  getChecklistItems,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  validateChecklist, // Import validation middleware
} = require("../controllers/checklistController"); 

const router = express.Router();

// Define Routes
router.get("/get", getChecklistItems);
router.post("/add", validateChecklist, addChecklistItem);
router.put("/update/:id", validateChecklist, updateChecklistItem);
router.delete("/delete/:id", deleteChecklistItem);

module.exports = router;
