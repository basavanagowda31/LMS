const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', subjectController.getSubjects);
router.get('/:id/tree', subjectController.getSubjectTree);
router.get('/videos/:id', authMiddleware, subjectController.getVideo);

module.exports = router;
