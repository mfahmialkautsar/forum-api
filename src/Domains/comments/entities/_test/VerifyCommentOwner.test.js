const VerifyCommentOwner = require('../VerifyCommentOwner');

describe('VerifyCommentOwner entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      credentialId: 'user-123',
    };

    // Action and Assert
    expect(() => new VerifyCommentOwner(payload)).toThrowError(
      'VERIFY_COMMENT_OWNER.NOT_CONTAIN_NEEDED_PROPERTIES',
    );
  });

  it('should throw error when payload does not meet data types specification', () => {
    // Arrange
    const payload = {
      commentId: true,
      credentialId: ['user-123'],
    };

    // Action and Assert
    expect(() => new VerifyCommentOwner(payload)).toThrowError(
      'VERIFY_COMMENT_OWNER.NOT_MEET_DATA_TYPES_SPECIFICATION',
    );
  });

  it('should create threadInput object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      credentialId: 'user-123',
    };

    // Action
    const { commentId, credentialId } = new VerifyCommentOwner(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(credentialId).toEqual(payload.credentialId);
  });
});
