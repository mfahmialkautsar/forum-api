const AddThread = require('../AddThread');

describe('AddThread entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      title: 'The title',
      body: 'Hi mom!',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTIES',
    );
  });

  it('should throw error when payload does not meet data types specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      credentialId: {},
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_MEET_DATA_TYPES_SPECIFICATION',
    );
  });

  it('should create threadInput object correctly', () => {
    // Arrange
    const payload = {
      title: 'The title',
      body: 'Hi mom!',
      credentialId: 'user-123',
    };

    // Action
    const { title, body, credentialId } = new AddThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(credentialId).toEqual(payload.credentialId);
  });
});
