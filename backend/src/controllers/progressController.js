const pool = require('../config/db');

exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subjectId } = req.params;

    // Get all videos for the subject to determine order
    const [videos] = await pool.query(`
      SELECT v.id, v.section_id, s.order_index as s_order, v.order_index as v_order
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      WHERE s.subject_id = ?
      ORDER BY s.order_index ASC, v.order_index ASC
    `, [subjectId]);

    // Get user progress
    const [progress] = await pool.query(`
      SELECT p.video_id, p.last_position_seconds, p.is_completed
      FROM video_progress p
      JOIN videos v ON p.video_id = v.id
      JOIN sections s ON v.section_id = s.id
      WHERE p.user_id = ? AND s.subject_id = ?
    `, [userId, subjectId]);

    const progressMap = progress.reduce((acc, curr) => {
      acc[curr.video_id] = curr;
      return acc;
    }, {});

    // Determine locks
    let isLocked = false;
    const tracking = videos.map((video, index) => {
      const isCompleted = progressMap[video.id]?.is_completed || false;
      
      const item = {
        videoId: video.id,
        isCompleted,
        lastPosition: progressMap[video.id]?.last_position_seconds || 0,
        isLocked: index === 0 ? false : isLocked // First video is always unlocked, otherwise inherits isLocked from previous iterations finding a non-completed video
      };

      if (!isCompleted) {
        isLocked = true; // Subsequent videos will be locked
      }

      return item;
    });

    res.json(tracking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { videoId, lastPosition, isCompleted } = req.body;

    await pool.query(`
      INSERT INTO video_progress (user_id, video_id, last_position_seconds, is_completed)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      last_position_seconds = VALUES(last_position_seconds),
      is_completed = CASE WHEN is_completed = TRUE THEN TRUE ELSE VALUES(is_completed) END
    `, [userId, videoId, lastPosition, isCompleted]);

    res.json({ message: 'Progress updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
