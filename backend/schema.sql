CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_url VARCHAR(255) NOT NULL,
  order_index INT NOT NULL,
  duration_seconds INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrollments (
  user_id INT NOT NULL,
  subject_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, subject_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS video_progress (
  user_id INT NOT NULL,
  video_id INT NOT NULL,
  last_position_seconds INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, video_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  user_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, token_hash),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert dummy data
INSERT INTO subjects (title, slug, description, is_published) 
VALUES ('Fullstack Web Development', 'fullstack-web-dev', 'Learn to build a fullstack web app using Next.js and Node.js', true)
ON DUPLICATE KEY UPDATE title=title;

INSERT INTO sections (subject_id, title, order_index)
VALUES 
(1, 'Introduction', 1),
(1, 'Frontend Development', 2),
(1, 'Backend Development', 3);

INSERT INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds)
VALUES 
(1, 'Course Overview', 'What we will build in this course', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 212),
(1, 'Setting up the Environment', 'Installing Node.js, VS Code and tools', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2, 600),
(2, 'Intro to React & Next.js', 'Core concepts of App Router', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 1200),
(2, 'Tailwind CSS Basics', 'Styling the frontend', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2, 900),
(3, 'Node.js & Express API', 'Building the backend', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 1800),
(3, 'Database Integration', 'MySQL and schemas', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2, 1000);
