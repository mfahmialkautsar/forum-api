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

  async getDetailThreadByIdIgnoreComments(id) {
    const detailThreadQuery = {
      text: `SELECT t.id, title, body, username, date
      FROM threads t
      INNER JOIN users u ON u.id = t.owner
      WHERE t.id = $1`,
      values: [id],
    };

    const threadsResult = await this._pool.query(detailThreadQuery);

    if (!threadsResult.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new DetailThread(threadsResult.rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres;
