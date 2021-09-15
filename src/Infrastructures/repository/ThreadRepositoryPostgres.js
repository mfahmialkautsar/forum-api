// const AuthorizationError = require('#commons/exceptions/AuthorizationError');
const NotFoundError = require('#commons/exceptions/NotFoundError');
const DetailComment = require('#domains/comments/entities/DetailComment');
const AddedThread = require('#domains/threads/entities/AddedThread');
const DetailThread = require('#domains/threads/entities/DetailThread');
const ThreadRepository = require('#domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body, credentialId } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner as owner',
      values: [id, title, body, credentialId],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }

  async verifyAvailableThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  // async verifyOwnership(getDetailThread) {
  //   const { threadId, userId } = getDetailThread;
  //   const query = {
  //     text: 'SELECT owner FROM threads WHERE id = $1',
  //     values: [threadId],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rowCount) {
  //     throw new NotFoundError('thread tidak ditemukan');
  //   }

  //   const threadOwner = result.rows[0].owner;
  //   if (threadOwner !== userId) {
  //     throw new AuthorizationError('anda tidak berhak mengakses resource ini');
  //   }
  // }

  async getDetailThreadById(id) {
    const detailThreadQuery = {
      text: `SELECT t.id, title, body, u.username as username, date FROM threads t
      INNER JOIN users u ON u.id = t.owner
      WHERE t.id = $1`,
      values: [id],
    };
    const commentsQuery = {
      text: `SELECT c.id, u.username, c.date, content, parent_comment_id as parentCommentId FROM comments c
      INNER JOIN users u ON u.id = c.owner
      INNER JOIN threads t ON t.id = c.thread_id
      WHERE t.id = $1
      ORDER BY c.date ASC`,
      values: [id],
    };
    const repliesQuery = (parentCommentId) => ({
      text: `SELECT r.id, u.username, r.date, r.content FROM comments r
      INNER JOIN comments c ON r.parent_comment_id = c.id
      INNER JOIN users u ON u.id = r.owner
      WHERE r.parent_comment_id = $1
      ORDER BY r.date ASC`,
      values: [parentCommentId],
    });

    const threadsResult = await this._pool.query(detailThreadQuery);

    if (!threadsResult.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    const commentsResult = await this._pool.query(commentsQuery);

    const subcomments = async (parentComments) => {
      const repliesResult = (comment) => this._pool.query(repliesQuery(comment.id));
      const repliesPromise = [];
      parentComments.rows.forEach((comment) => repliesPromise.push(repliesResult(comment)));
      const replies = await Promise.all(repliesPromise);
      return replies.map((comment) => comment.rows.map((reply) => new DetailComment(reply)));
    };

    const mappedReplies = await subcomments(commentsResult);

    const mappedComments = commentsResult.rows.map((comment, i) => new DetailComment({
      ...comment,
      replies: mappedReplies[i].length ? mappedReplies[i] : undefined,
    }));

    const detailThreadPayload = {
      ...threadsResult.rows[0],
      comments: mappedComments.length ? mappedComments : undefined,
    };

    return new DetailThread(detailThreadPayload);
  }
}

module.exports = ThreadRepositoryPostgres;
