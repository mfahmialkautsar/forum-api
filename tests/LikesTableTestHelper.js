/* istanbul ignore file */
const pool = require('#infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123',
    credentialId = 'user-123',
    commentId = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, credentialId, commentId],
    };

    await pool.query(query);
  },
  async findLikeById(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
