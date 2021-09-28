const AuthorizationError = require('#commons/exceptions/AuthorizationError');
const NotFoundError = require('#commons/exceptions/NotFoundError');
const AddComment = require('#domains/comments/entities/AddComment');
const AddedComment = require('#domains/comments/entities/AddedComment');
const AddReply = require('#domains/comments/entities/AddReply');
const VerifyCommentOwner = require('#domains/comments/entities/VerifyCommentOwner');
const pool = require('#infrastructures/database/postgres/pool');
const CommentsTableTestHelper = require('#tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('#tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('#tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await UsersTableTestHelper.addUser({
      id: 'user-321',
      username: 'stark',
    });
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('getCommentsByThreadIdIgnoreRepliesOrderByDateAsc function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const detailComment = await commentRepositoryPostgres.getCommentsByThreadIdIgnoreRepliesOrderByDateAsc(
        'thread-123',
      );

      // Assert
      expect(detailComment).toStrictEqual([
        {
          id: 'comment-123',
          content: 'A commnet',
          username: 'bruce',
          date: new Date('2006-07-03 17:18:43 +0700'),
          deleted_at: null,
        },
      ]);
    });
  });

  describe('getCommentsByParentCommentIdIgnoreRepliesOrderByDateAsc function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addReply({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const detailComment = await commentRepositoryPostgres.getCommentsByParentCommentIdIgnoreRepliesOrderByDateAsc(
        'comment-123',
      );

      // Assert
      expect(detailComment).toStrictEqual([
        {
          id: 'reply-123',
          content: 'A commnet',
          username: 'bruce',
          date: new Date('2006-07-03 17:18:43 +0700'),
          deleted_at: null,
        },
      ]);
    });
  });

  describe('addComment function', () => {
    it('should persist added comment and return it correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'A commnet',
        credentialId: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      );
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'A comment',
        credentialId: 'user-123',
        deleted_at: null,
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment,
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'A comment',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('addReply function', () => {
    it('should persist added comment and return it correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        parentCommentId: 'comment-123',
        content: 'A commnet',
        credentialId: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      await CommentsTableTestHelper.addComment({});

      // Action
      await commentRepositoryPostgres.addReply(addReply);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        'reply-123',
      );
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        parentCommentId: 'comment-123',
        content: 'A comment',
        credentialId: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      await CommentsTableTestHelper.addComment({});

      // Action
      const addedComment = await commentRepositoryPostgres.addReply(addReply);

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'reply-123',
          content: 'A comment',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment('comment-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment('comment-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(
          new VerifyCommentOwner({
            commentId: 'comment-123',
            credentialId: 'user-123',
          }),
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when user is not comment owner', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({
        credentialId: 'user-321',
      });

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(
          new VerifyCommentOwner({
            commentId: 'comment-123',
            credentialId: 'user-123',
          }),
        ),
      ).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('softDeleteComment function', () => {
    it('should soft delete comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const payload = {
        id: 'comment-123',
      };
      await CommentsTableTestHelper.addComment({});

      // Action
      await commentRepositoryPostgres.softDeleteComment(payload);

      // Assert
      const deletedComment = await CommentsTableTestHelper.findCommentById(
        payload.id,
      );
      expect(deletedComment[0].deleted_at).toBeDefined();
    });
  });
});
