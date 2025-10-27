const express = require('express');
const router = express.Router();
const { subscribe, getAllSubscribers } = require('../controllers/newsletterController');

router.post('/subscribe', subscribe);
router.get('/subscribers', getAllSubscribers);

module.exports = router;
