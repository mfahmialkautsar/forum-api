const RegisteredUser = require('../RegisteredUser');

describe('RegisteredUser entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTIES');
  });

  it('should throw error when payload did not meet data types specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      fullname: {},
    };

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_MEET_DATA_TYPES_SPECIFICATION');
  });

  it('should create registeredUser object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };

    // Action
    const registeredUser = new RegisteredUser(payload);

    // Assert
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});
