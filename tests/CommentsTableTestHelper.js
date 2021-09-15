const pool = require('#infrastructures/database/postgres/pool');

/* istanbul ignore file */
const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'A commnet',
    credentialId = 'user-123',
    threadId = 'thread-123',
    date = new Date('2006-07-03 17:18:43 +0700'),
  }) {
    const query = {
      text: `INSERT INTO comments
      (id, content, owner, thread_id, date)
      VALUES($1, $2, $3, $4, $5)`,
      values: [id, content, credentialId, threadId, date],
    };

    await pool.query(query);
  },
  async addReply({
    id = 'reply-123',
    content = 'A commnet',
    credentialId = 'user-123',
    parentCommentId = 'comment-123',
    date = new Date('2006-07-03 17:18:43 +0700'),
  }) {
    const query = {
      text: `INSERT INTO comments
      (id, content, owner, parent_comment_id, date)
      VALUES($1, $2, $3, $4, $5)`,
      values: [id, content, credentialId, parentCommentId, date],
    };

    await pool.query(query);
  },
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
