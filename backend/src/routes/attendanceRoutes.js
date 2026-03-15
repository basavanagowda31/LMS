const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, attendanceController.getAttendance);
router.post('/check-in', authMiddleware, attendanceController.checkIn);

module.exports = router;
