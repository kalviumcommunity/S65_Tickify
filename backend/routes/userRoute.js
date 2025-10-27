const express = require('express');
const { 
  getUsers,
  getUserAccounts,
  signup, 
  signin, 
  verifyPassword, 
  createSubAccount,
  switchAccount,
  deleteAccount,
  updateAccount,
  getCurrentUser,
  checkAccountExists,
  validateUser
} = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/signup", validateUser, signup);
router.post("/signin", validateUser, signin);
router.post("/verify", verifyPassword);


router.get("/", authenticate, getUsers);
router.get("/accounts", authenticate, getUserAccounts);
router.post("/accounts", authenticate, createSubAccount);
router.post("/accounts/switch", authenticate, switchAccount);
router.delete("/accounts/:accountId", authenticate, deleteAccount);
router.patch("/accounts/:accountId", authenticate, updateAccount);
router.get("/:userId", authenticate, getCurrentUser);
router.post("/check-account", authenticate, checkAccountExists);
module.exports = router;