const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoke unimplemented mehtods', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    await expect(
      commentRepository.getCommentsByThreadIdIgnoreRepliesOrderByDateAsc({}),
    ).rejects.toThrowError('COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED');
    await expect(
      commentRepository.getCommentsByParentCommentIdIgnoreRepliesOrderByDateAsc(
        {},
      ),
    ).rejects.toThrowError('COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED');
    await expect(commentRepository.addComment({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED',
    );
    await expect(commentRepository.addReply({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED',
    );
    await expect(
      commentRepository.verifyAvailableComment({}),
    ).rejects.toThrowError('COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED');
    await expect(commentRepository.verifyCommentOwner({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED',
    );
    await expect(commentRepository.softDeleteComment({})).rejects.toThrowError(
      'COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED',
    );
  });
});
