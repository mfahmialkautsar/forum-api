const pool = require('#infrastructures/database/postgres/pool');
const CommentsTableTestHelper = require('#tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('#tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('#tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('#tests/UsersTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLikeByCommentId function', () => {
    it('should persist added like', async () => {
      // Arrange
      const addLike = {
        commentId: 'comment-123',
        credentialId: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await likeRepositoryPostgres.addLikeByCommentId(addLike);

      // Assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      expect(like).toHaveLength(1);
    });
  });

  describe('deleteLikeByCommentIdAndOwner function', () => {
    it('should delete like', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const payload = {
        commentId: 'comment-123',
        credentialId: 'user-123',
      };
      await LikesTableTestHelper.addLike({ id: 'like-123', ...payload });

      // Action
      await likeRepositoryPostgres.deleteLikeByCommentIdAndOwner(payload);

      // Assert
      const deletedLike = await LikesTableTestHelper.findLikeById('like-123');
      expect(deletedLike.length).toBe(0);
    });
  });

  describe('getLikeCountsByCommentId function', () => {
    it('should return like counts correctly', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const payload = 'comment-123';
      await LikesTableTestHelper.addLike({});
      await LikesTableTestHelper.addLike({ id: 'like-124' });

      // Action
      const likeCounts = await likeRepositoryPostgres.getLikeCountsByCommentId(
        payload,
      );

      // Assert
      expect(likeCounts).toEqual('2');
    });
  });

  describe('verifyAvailableLikeByCommentIdAndOwner function', () => {
    it('should return false when like not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const payload = {
        commentId: 'comment-123',
        credentialId: 'user-123',
      };

      // Action & Assert
      await expect(
        likeRepositoryPostgres.isLikeByCommentIdAndOwnerAvailable(payload),
      ).resolves.toBeFalsy();
    });

    it('should not return true when like is found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const payload = {
        commentId: 'comment-123',
        credentialId: 'user-123',
      };
      await LikesTableTestHelper.addLike({});

      // Aciton & Assert
      await expect(
        likeRepositoryPostgres.isLikeByCommentIdAndOwnerAvailable(payload),
      ).resolves.toBeTruthy();
    });
  });
});
