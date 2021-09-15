const AddReply = require('../AddReply');

describe('AddReply entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      parentCommentId: 'comment-123',
      content: 'A commnet',
    };

    // Action & Assert
    expect(() => new AddReply(payload)).toThrow(
      'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTIES',
    );
  });

  it('should throw error when payload does not meet data types specification', () => {
    // Arrange
    const payload = {
      parentCommentId: 123,
      content: ['A commnet'],
      credentialId: { user: 'user-123' },
    };

    // Action & Assert
    expect(() => new AddReply(payload)).toThrowError(
      'ADD_REPLY.NOT_MEET_DATA_TYPES_SPECIFICATION',
    );
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      parentCommentId: 'comment-123',
      content: 'A commnet',
      credentialId: 'user-123',
    };

    // Action
    const addComment = new AddReply(payload);

    // Assert
    expect(addComment).toBeInstanceOf(AddReply);
    expect(addComment.parentCommentId).toEqual(payload.parentCommentId);
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.credentialId).toEqual(payload.credentialId);
  });
});
