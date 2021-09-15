const DetailComment = require('#domains/comments/entities/DetailComment');
const DetailThread = require('../DetailThread');

describe('DetailThread entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      title: 'The title',
      body: 'Hi mom!',
      username: 'bruce',
      date: new Date('2006-07-03 17:18:43 +0700'),
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTIES',
    );
  });

  it('should throw error when payload did not meet data types specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: true,
      body: {},
      username: [],
      date: 'today',
      comments: '[]',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPES_SPECIFICATION',
    );
  });

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-321',
      title: 'The title',
      body: 'Hi mom!',
      date: new Date('2006-07-03 17:18:43 +0700'),
      username: 'bruce',
      comments: [
        new DetailComment({
          id: 'comment-123',
          content: 'A comment',
          date: new Date('2006-07-03 17:18:43 +0700'),
          username: 'bruce',
        }),
      ],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.comments).toEqual(payload.comments);
  });
});
