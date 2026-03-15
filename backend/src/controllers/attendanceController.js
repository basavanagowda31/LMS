const pool = require('../config/db');

exports.getAttendance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const [rows] = await pool.query(
      'SELECT id, date FROM attendance WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0];

    await pool.query(
      'INSERT INTO attendance (user_id, date) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id',
      [userId, today]
    );

    res.json({ message: 'Attendance marked for today', date: today });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
