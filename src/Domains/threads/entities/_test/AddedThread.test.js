const AddedThread = require('../AddedThread');

describe('a AddedThread entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      title: 'The title',
      owner: 'user-123',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTIES');
  });

  it('should throw error when payload does not meet data types specification', () => {
    // Arrange
    const payload = {
      id: {},
      title: 123,
      owner: true,
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError(
      'ADDED_THREAD.NOT_MEET_DATA_TYPES_SPECIFICATION',
    );
  });

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'The title',
      owner: 'user-123',
    };

    // Action
    const { id, title, owner } = new AddedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
