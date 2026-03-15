const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/:subjectId', progressController.getProgress);
router.post('/update', progressController.updateProgress);

module.exports = router;
