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
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    // it('should throw NotFoundError when trying to comment at unavailable thread', async () => {
    //   // Arrange
    //   const addComment = new AddComment({
    //     threadId: 'thread-123',
    //     content: 'A commnet',
    //     credentialId: 'user-123',
    //   });
    //   const fakeIdGenerator = () => '123';
    //   const commentRepositoryPostgres = new CommentRepositoryPostgres(
    //     pool,
    //     fakeIdGenerator
    //   );

    //   // Action
    //   const addedComment = await commentRepositoryPostgres.addComment(
    //     addComment
    //   );

    //   // Assert
    //   expect(addedComment).rejects.toThrowError(NotFoundError);
    // });

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
      await ThreadsTableTestHelper.addThread({});

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
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      await ThreadsTableTestHelper.addThread({});

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
      await ThreadsTableTestHelper.addThread({});
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
      await ThreadsTableTestHelper.addThread({});
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
      await ThreadsTableTestHelper.addThread({});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment('comment-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({});
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
      await ThreadsTableTestHelper.addThread({});

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
      await ThreadsTableTestHelper.addThread({});
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

  describe('deleteComment function', () => {
    it('should soft delete comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const payload = {
        commentId: 'comment-123',
        credentialId: 'user-123',
      };
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      await commentRepositoryPostgres.deleteComment(payload);

      // Assert
      const deletedComment = await CommentsTableTestHelper.findCommentById(
        payload.commentId,
      );
      expect(deletedComment[0].content).toEqual('**komentar telah dihapus**');
      expect(deletedComment[0].deleted_at).toBeDefined();
    });
  });

  describe('deleteReply function', () => {
    it('should soft delete reply', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const payload = {
        replyId: 'reply-123',
        credentialId: 'user-123',
      };
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addReply({});

      // Action
      await commentRepositoryPostgres.deleteReply(payload);

      // Assert
      const deletedReply = await CommentsTableTestHelper.findCommentById(
        payload.replyId,
      );
      expect(deletedReply[0].content).toEqual('**balasan telah dihapus**');
      expect(deletedReply[0].deleted_at).toBeDefined();
    });
  });
});