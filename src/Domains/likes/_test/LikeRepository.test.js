const LikeRepository = require('../LikeRepository');

describe('LikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Actions and Assertt
    await expect(likeRepository.addLikeByCommentId({})).rejects.toThrowError(
      'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(
      likeRepository.deleteLikeByCommentIdAndOwner({}),
    ).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      likeRepository.getLikeCountsByCommentId({}),
    ).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      likeRepository.isLikeByCommentIdAndOwnerAvailable({}),
    ).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
