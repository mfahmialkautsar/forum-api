const NotFoundError = require('#commons/exceptions/NotFoundError');
const LikeRepository = require('#domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLikeByCommentId(addLike) {
    const { commentId, credentialId } = addLike;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, credentialId, commentId],
    };

    await this._pool.query(query);
  }

  async deleteLikeByCommentIdAndOwner(deleteLike) {
    const { commentId, credentialId } = deleteLike;
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, credentialId],
    };

    await this._pool.query(query);
  }

  async getLikeCountsByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0].count;
  }

  async isLikeByCommentIdAndOwnerAvailable(verifyAvailableLike) {
    const { commentId, credentialId } = verifyAvailableLike;
    const query = {
      text: 'SELECT id FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, credentialId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }
}

module.exports = LikeRepositoryPostgres;
