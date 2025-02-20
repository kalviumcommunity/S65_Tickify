const express = require("express");
const {
  getChecklistItems,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} = require("../controllers/checklistController"); // Import Controllers

const router = express.Router();

// Define Routes
router.get("/get", getChecklistItems); //  GET All
router.post("/add", addChecklistItem); //  POST New
router.put("/update/:id", updateChecklistItem); //  PUT Update (Fixed)
router.delete("/delete/:id", deleteChecklistItem); //  DELETE Item (Fixed)

module.exports = router;
