const AddComment = require('../AddComment');

describe('AddCommnet entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'A commnet',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrow(
      'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTIES',
    );
  });

  it('should throw error when payload does not meet data types specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      content: ['A commnet'],
      credentialId: { user: 'user-123' },
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPES_SPECIFICATION',
    );
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'A commnet',
      credentialId: 'user-123',
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment).toBeInstanceOf(AddComment);
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.credentialId).toEqual(payload.credentialId);
  });
});
