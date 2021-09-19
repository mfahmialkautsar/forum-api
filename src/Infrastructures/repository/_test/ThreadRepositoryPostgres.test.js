const AddThread = require('#domains/threads/entities/AddThread');
const ThreadRepositoryPostgres = require('#infrastructures/repository/ThreadRepositoryPostgres');
const pool = require('#infrastructures/database/postgres/pool');
const ThreadsTableTestHelper = require('#tests/ThreadsTableTestHelper');
const AddedThread = require('#domains/threads/entities/AddedThread');
const UsersTableTestHelper = require('#tests/UsersTableTestHelper');
const NotFoundError = require('#commons/exceptions/NotFoundError');
const DetailThread = require('#domains/threads/entities/DetailThread');
const CommentsTableTestHelper = require('#tests/CommentsTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'bruce',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist added thread and return it correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'The title',
        body: 'Hi mom!',
        credentialId: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'The title',
        body: 'Hi mom!',
        credentialId: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'The title',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread('thread-123'),
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getDetailThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getDetailThreadById('thread-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-321' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getDetailThreadById(
        'thread-321',
      );

      // Assert
      expect(thread).toStrictEqual(
        new DetailThread({
          id: 'thread-321',
          title: 'The title',
          body: 'Hi mom!',
          username: 'bruce',
          date: '2006-07-03T17:18:43+07:00',
        }),
      );
    });

    it('should return thread with comments correctly', async () => {
      // Arrange
      const commentPayload = {
        id: 'comment-123',
        content: 'A commnet',
        credentialId: 'user-123',
        threadId: 'thread-321',
        date: '2006-07-03T17:18:43+07:00',
      };
      await ThreadsTableTestHelper.addThread({ id: commentPayload.threadId });
      await CommentsTableTestHelper.addComment(commentPayload);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getDetailThreadById(
        'thread-321',
      );

      // Assert
      expect(thread).toStrictEqual(
        new DetailThread({
          id: 'thread-321',
          title: 'The title',
          body: 'Hi mom!',
          username: 'bruce',
          date: '2006-07-03T17:18:43+07:00',
          comments: [{
            id: commentPayload.id,
            username: 'bruce',
            date: commentPayload.date,
            content: commentPayload.content,
          },
          ],
        }),
      );
    });

    it('should return thread with comments and replies correctly', async () => {
      // Arrange
      const commentPayload = {
        id: 'comment-123',
        content: 'A commnet',
        credentialId: 'user-123',
        threadId: 'thread-321',
        date: '2006-07-03T17:18:43+07:00',
      };
      await ThreadsTableTestHelper.addThread({ id: commentPayload.threadId });
      await CommentsTableTestHelper.addComment(commentPayload);
      await CommentsTableTestHelper.addReply({
        id: 'reply-123',
        parentCommentId: commentPayload.id,
        username: 'bruce',
        date: commentPayload.date,
        content: commentPayload.content,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getDetailThreadById(
        'thread-321',
      );

      // Assert
      expect(thread).toStrictEqual(
        new DetailThread({
          id: 'thread-321',
          title: 'The title',
          body: 'Hi mom!',
          username: 'bruce',
          date: '2006-07-03T17:18:43+07:00',
          comments: [{
            id: commentPayload.id,
            username: 'bruce',
            date: commentPayload.date,
            content: commentPayload.content,
            replies: [{
              id: 'reply-123',
              username: 'bruce',
              date: commentPayload.date,
              content: commentPayload.content,
            },
            ],
          },
          ],
        }),
      );
    });
  });
});
