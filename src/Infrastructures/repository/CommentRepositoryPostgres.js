const AuthorizationError = require('#commons/exceptions/AuthorizationError');
const NotFoundError = require('#commons/exceptions/NotFoundError');
const CommentRepository = require('#domains/comments/CommentRepository');
const AddedComment = require('#domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const {
      threadId,
      content,
      credentialId,
    } = addComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO comments
      (id, content, owner, thread_id)
      VALUES($1, $2, $3, $4)
      RETURNING id, content, owner`,
      values: [id, content, credentialId, threadId],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async addReply(addReply) {
    const {
      parentCommentId,
      content,
      credentialId,
    } = addReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO comments
      (id, content, owner, parent_comment_id)
      VALUES($1, $2, $3, $4)
      RETURNING id, content, owner`,
      values: [id, content, credentialId, parentCommentId],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async deleteComment(deleteComment) {
    const { replacement, commentId, credentialId } = deleteComment;
    const query = {
      text: `UPDATE comments
      SET deleted_at = CURRENT_TIMESTAMP,
      content = $1
      WHERE id = $2 AND owner = $3`,
      values: [replacement, commentId, credentialId],
    };

    await this._pool.query(query);
  }

  async deleteReply(deleteReply) {
    const { replacement, replyId, credentialId } = deleteReply;
    const query = {
      text: `UPDATE comments
      SET deleted_at = CURRENT_TIMESTAMP,
      content = $1
      WHERE id = $2 AND owner = $3`,
      values: [replacement, replyId, credentialId],
    };

    await this._pool.query(query);
  }

  async verifyAvailableComment(commentId) {
    const query = {
      text: `SELECT * FROM comments
      WHERE id = $1 AND deleted_at IS null`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('comment tidak ditemukan');
  }

  async verifyCommentOwner(verifyCommentOwner) {
    const { commentId, credentialId } = verifyCommentOwner;
    const query = {
      text: `SELECT owner FROM comments
      WHERE id = $1`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('comment tidak ditemukan');

    if (result.rows[0].owner !== credentialId) throw new AuthorizationError('anda tidak berhak mengakses resource ini');
  }
}

module.exports = CommentRepositoryPostgres;
