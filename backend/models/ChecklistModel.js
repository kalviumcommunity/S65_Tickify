const mongoose = require("mongoose");

const ChecklistSchema = new mongoose.Schema({
  text: 
  { 
    type: String, 
    required: true 
},
  completed: 
  {
    type: Boolean,
    default: false 
},
  priority: 
  {
    type: String,
    enum: ["low", "medium", "high"], 
    default: "low"
},
},
{
  timestamps: true

});

module.exports = mongoose.model("Checklist", ChecklistSchema);
