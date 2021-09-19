const DeleteComment = require('../DeleteComment');

describe('DeleteComment entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      replacement: '**komentar telah dihapus**',
      threadId: 'thread-123',
      credentialId: 'user-123',
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTIES',
    );
  });

  it('should throw error when payload does not data types specification', () => {
    // Arrange
    const payload = {
      replacement: '**komentar telah dihapus**',
      threadId: true,
      commentId: ['comment-123'],
      credentialId: 123,
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_MEET_DATA_TYPES_SPECIFICATION',
    );
  });

  it('should create deleteComment object correctly', () => {
    // Arrange
    const payload = {
      replacement: '**komentar telah dihapus**',
      threadId: 'thread-123',
      commentId: 'comment-123',
      credentialId: 'user-123',
    };

    // Action
    const deleteComment = new DeleteComment(payload);

    // Assert
    expect(deleteComment).toBeInstanceOf(DeleteComment);
    expect(deleteComment.threadId).toEqual(payload.threadId);
    expect(deleteComment.commentId).toEqual(payload.commentId);
    expect(deleteComment.credentialId).toEqual(payload.credentialId);
  });
});
