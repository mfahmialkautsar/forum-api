const GetDetailThread = require('../GetDetailThread');

describe('GetDetailThread entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
    };

    // Action and Assert
    expect(() => new GetDetailThread(payload)).toThrowError(
      'GET_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTIES',
    );
  });

  it('should throw error when payload does not meet data types specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      userId: {},
    };

    // Action and Assert
    expect(() => new GetDetailThread(payload)).toThrowError(
      'GET_DETAIL_THREAD.NOT_MEET_DATA_TYPES_SPECIFICATION',
    );
  });

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      userId: 'user-123',
    };

    // Action
    const { threadId, userId } = new GetDetailThread(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(userId).toEqual(payload.userId);
  });
});
