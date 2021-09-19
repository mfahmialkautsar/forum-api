const NotFoundError = require('#commons/exceptions/NotFoundError');
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

  async getDetailThreadById(id) {
    const detailThreadQuery = {
      text: `SELECT 
      json_strip_nulls(
        json_build_object(
          'id', t.id,
          'title', title,
          'body', body,
          'username', u.username,
          'comments', (
            SELECT json_strip_nulls(
                json_agg(
                  json_build_object(
                    'id',
                    c.id,
                    'username',
                    u1.username,
                    'date',
                    c.date,
                    'content',
                    c.content,
                    'replies',
                    (
                      SELECT json_strip_nulls(
                          json_agg(
                            json_build_object(
                              'id',
                              r.id,
                              'username',
                              u2.username,
                              'date',
                              r.date,
                              'content',
                              r.content
                            )
                            ORDER BY r.date ASC
                          )
                        )
                      FROM comments r
                        INNER JOIN comments c2 ON r.parent_comment_id = c2.id
                        INNER JOIN users u2 ON u2.id = r.owner
                      WHERE r.parent_comment_id = c.id
                    )
                  )
                  ORDER BY c.date ASC
                )
              )
            FROM comments c
              INNER JOIN users u1 ON u1.id = c.owner
              INNER JOIN threads t1 ON t1.id = c.thread_id
            WHERE t1.id = t.id
          ),
          'date', date
        )
      )
      FROM threads t
        INNER JOIN users u ON u.id = t.owner
      WHERE t.id = $1`,
      values: [id],
    };

    const threadsResult = await this._pool.query(detailThreadQuery);

    if (!threadsResult.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new DetailThread(threadsResult.rows[0].json_strip_nulls);
  }
}

module.exports = ThreadRepositoryPostgres;
