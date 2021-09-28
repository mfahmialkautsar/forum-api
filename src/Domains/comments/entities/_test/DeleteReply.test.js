const DeleteReply = require('../DeleteReply');

describe('DeleteReply entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      parentCommentId: 'comment-123',
      credentialId: 'user-123',
    };

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTIES',
    );
  });

  it('should throw error when payload does not data types specification', () => {
    // Arrange
    const payload = {
      id: ['comment-123'],
      threadId: true,
      parentCommentId: { s: 'comment-123' },
      credentialId: 123,
    };

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_MEET_DATA_TYPES_SPECIFICATION',
    );
  });

  it('should create deleteReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      threadId: 'thread-123',
      parentCommentId: 'comment-123',
      credentialId: 'user-123',
    };

    // Action
    const deleteReply = new DeleteReply(payload);

    // Assert
    expect(deleteReply).toBeInstanceOf(DeleteReply);
    expect(deleteReply.id).toEqual(payload.id);
    expect(deleteReply.threadId).toEqual(payload.threadId);
    expect(deleteReply.parentCommentId).toEqual(payload.parentCommentId);
    expect(deleteReply.credentialId).toEqual(payload.credentialId);
  });
});
