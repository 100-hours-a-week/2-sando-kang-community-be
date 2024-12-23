const connection = require('../db/db');

// NOTE: 게시글 목록 조회
exports.getPaginatedPosts = async (startIndex, pageSize) => {
  // startIndex와 pageSize가 숫자인지 확인
  if (typeof startIndex !== 'number' || typeof pageSize !== 'number') {
    throw new Error('Invalid pagination parameters: startIndex and pageSize must be numbers.');
  }

  const query = `
    SELECT 
        post.id,
        user.nickname AS author,
        COALESCE(user.profile, '') AS profile, -- NULL 처리
        post.title,
        post.content,
        COALESCE(post.image, '') AS image,    -- NULL 처리
        post.date,
        post.likes,
        post.views,
        post.comments 
    FROM 
        post 
    JOIN
        user ON post.user_id = user.id
    ORDER BY post.date DESC 
    LIMIT ?, ?;
  `;

  try {
    const [rows] = await connection.query(query, [startIndex, pageSize]);
    console.log(`Fetched ${rows.length} rows from startIndex ${startIndex}`);
    return rows;
  } catch (error) {
    console.error('Error fetching paginated posts at getPaginatedPosts:', error.message);
    throw new Error('Database error while fetching paginated posts.');
  }
};

// NOTE: 게시글 작성
exports.createPost = async (user_id, title, content, postUrl, date) => {
  const query = `INSERT INTO post (user_id, title, content, image, date, likes, views, comments) 
                 VALUES (?, ?, ?, ?, ?, 0, 1, 0)`;
  try {
    const [result] = await connection.query(query, [user_id, title, content, postUrl, date]);
    return result.insertId; 
  } catch (error) {
    console.error('Error creating post:', error.message);
    throw error;
  }
};

// NOTE: 특정 게시글 조회
exports.getPostById = async (postId) => {
  const query = `SELECT id, title, content, user_id, image, date, likes, views, comments 
                 FROM post WHERE id = ?`;
  try {
    const [rows] = await connection.query(query, [postId]);
    if (rows.length === 0) {
      throw new Error(`No post found with id: ${postId}`);
    }
   
    return rows[0];
  } catch (error) {
    console.error('Error fetching post by ID:', error.message);
    throw error;
  }
};

// NOTE: 사용자별 게시글 조회
exports.findPostByUserId = async (user_id) => {
  const query = `SELECT * FROM post WHERE user_id = ?`;
  try {
    const [rows] = await connection.query(query, [user_id]);
    return rows;
  } catch (error) {
    console.error('Error fetching posts by user ID:', error.message);
    throw error;
  }
};

// NOTE: 게시글 수정
exports.updatePost = async (user_id, post_id, title, content, image, date) => {
  const query = `UPDATE post 
                 SET title = ?, content = ?, image = ?, date = ? 
                 WHERE user_id = ? AND id = ?`;
  try {
    const [result] = await connection.query(query, [title, content, image, date, user_id, post_id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Error updating post:', error.message);
    throw error;
  }
};

// NOTE: 게시글 삭제
exports.deletePost = async (post_id) => {
  const query = `DELETE FROM post WHERE id = ?`;
  try {
    const [result] = await connection.query(query, [post_id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Error deleting post:', error.message);
    throw error;
  }
};

// NOTE: 댓글 추가
exports.addReply = async (post_id) => {
  const query = `UPDATE post SET comments = comments + 1 WHERE id = ?`;
  try {
    const [result] = await connection.query(query, [post_id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Error adding reply:', error.message);
    throw error;
  }
};

// NOTE: 댓글 감소
exports.discountComment = async (post_id) => {
  const query = `UPDATE post SET comments = comments - 1 WHERE id = ?`;
  try {
    const [result] = await connection.query(query, [post_id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Error discounting comment:', error.message);
    throw error;
  }
};

// NOTE: 게시글 좋아요
exports.patchPost = async (post_id) => {
  const query = `UPDATE post SET likes = likes + 1 WHERE id = ?`;
  try {
    const [result] = await connection.query(query, [post_id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Error patching post likes:', error.message);
    throw error;
  }
};

// NOTE: 게시글 조회수
exports.updateViews = async (post_id) => {
  const query = `UPDATE post SET views = views + 1 WHERE id = ?`;
  try {
    const [result] = await connection.query(query, [post_id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Error patching post likes:', error.message);
    throw error;
  }
};
