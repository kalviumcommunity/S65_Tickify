const express = require("express");
const {
  getChecklistItems,
  getChecklistItemsByUser,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  validateChecklist,
} = require("../controllers/checklistController");

const router = express.Router();

// Define Routes
router.get("/get", getChecklistItems);
router.get("/user/:userId", getChecklistItemsByUser);
router.post("/add", validateChecklist, addChecklistItem);
router.put("/update/:id", validateChecklist, updateChecklistItem);
router.delete("/delete/:id", deleteChecklistItem);

module.exports = router;