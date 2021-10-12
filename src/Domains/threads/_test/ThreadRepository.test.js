const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Actions and Assert
    await expect(threadRepository.addThread({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(
      threadRepository.verifyAvailableThread('thread-123'),
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    // await expect(threadRepository.verifyOwnership({})).rejects.toThrowError(
    //   'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    // );
    // await expect(
    //   threadRepository.getThreadById('thread-123')
    // ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      threadRepository.getDetailThreadById('thread-123'),
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
