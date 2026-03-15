const pool = require('../config/db');

exports.getSubjects = async (req, res) => {
  try {
    const [subjects] = await pool.query('SELECT * FROM subjects WHERE is_published = TRUE');
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSubjectTree = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if subject exists
    const [subjects] = await pool.query('SELECT * FROM subjects WHERE id = ?', [id]);
    if (subjects.length === 0) return res.status(404).json({ message: 'Subject not found' });
    const subject = subjects[0];

    // Get sections
    const [sections] = await pool.query('SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index ASC', [id]);
    
    // Get videos
    const [videos] = await pool.query(`
      SELECT v.* 
      FROM videos v 
      JOIN sections s ON v.section_id = s.id 
      WHERE s.subject_id = ? 
      ORDER BY s.order_index ASC, v.order_index ASC
    `, [id]);

    // Construct tree
    const tree = sections.map(section => ({
      ...section,
      lessons: videos.filter(v => v.section_id === section.id)
    }));

    res.json({ ...subject, sections: tree });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const [videos] = await pool.query('SELECT * FROM videos WHERE id = ?', [id]);
    if (videos.length === 0) return res.status(404).json({ message: 'Video not found' });
    
    res.json(videos[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
