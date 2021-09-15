const DetailComment = require('../DetailComment');

describe('DetailComment entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'A comment',
      date: new Date('2006-07-03 17:18:43 +0700'),
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTIES',
    );
  });

  it('should throw error when payload does not meet data types specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: { content: 'A comment' },
      date: true,
      username: ['bruce'],
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPES_SPECIFICATION',
    );
  });

  it('should create detailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'A comment',
      date: new Date('2006-07-03 17:18:43 +0700'),
      username: 'bruce',
      replies: [
        new DetailComment({
          id: 'reply-123',
          content: 'A reply',
          date: new Date('2006-07-03 17:18:43 +0700'),
          username: 'wayne',
        }),
      ],
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
  });
});
