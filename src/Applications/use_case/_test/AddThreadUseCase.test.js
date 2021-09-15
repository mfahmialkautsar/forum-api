const AddThread = require('#domains/threads/entities/AddThread');
const AddedThread = require('#domains/threads/entities/AddedThread');
const ThreadRepository = require('#domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'The title',
      body: 'Hi mom!',
      credentialId: 'user-123',
    };
    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.credentialId,
    });

    /** create use case dependency */
    const mockThreadRepository = new ThreadRepository();

    /** mock needed functions */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));

    /** create use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread(useCasePayload),
    );
  });
});
