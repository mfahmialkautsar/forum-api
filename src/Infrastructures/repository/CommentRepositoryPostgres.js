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

  async getCommentsByThreadIdIgnoreRepliesOrderByDateAsc(threadId) {
    const query = {
      text: `SELECT c.id, content, username, date, c.deleted_at FROM comments c
      INNER JOIN users u ON u.id = c.owner
      WHERE thread_id = $1
      ORDER BY date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getCommentsByParentCommentIdIgnoreRepliesOrderByDateAsc(parentCommentId) {
    const query = {
      text: `SELECT c.id, content, username, date, c.deleted_at FROM comments c
      INNER JOIN users u ON u.id = c.owner
      WHERE parent_comment_id = $1
      ORDER BY date ASC`,
      values: [parentCommentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
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

  async softDeleteComment(deleteComment) {
    const { id } = deleteComment;
    const query = {
      text: `UPDATE comments
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1`,
      values: [id],
    };

    await this._pool.query(query);
  }

  // async likeComment(likeComment) {
  //   const {id} = likeComment;
  //   const query = {
  //     text: `UPDATE comments`
  //   }
  // }

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
