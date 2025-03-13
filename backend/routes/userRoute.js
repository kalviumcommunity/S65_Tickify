const express = require('express');
const { getUsers, signup, signin, validateUser } = require('../controllers/userController');

const router = express.Router();

router.get("/", getUsers);
router.post("/signup",validateUser, signup);
router.post("/signin",validateUser, signin)

module.exports = router;