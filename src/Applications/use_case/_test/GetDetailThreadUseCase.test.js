const DetailThread = require('#domains/threads/entities/DetailThread');
// const GetDetailThread = require('#domains/threads/entities/GetDetailThread');
const ThreadRepository = require('#domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
    };
    const expecteDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'The title',
      body: 'Hi mom!',
      username: 'bruce',
      date: new Date('2006-07-03 17:18:43 +0700'),
      comments: [],
    });

    /** create use case dependency */
    const mockThreadRepository = new ThreadRepository();

    /** mock needed functions */
    // mockThreadRepository.verifyOwnership = jest
    //   .fn()
    //   .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getDetailThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expecteDetailThread));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toStrictEqual(expecteDetailThread);
    // expect(mockThreadRepository.verifyOwnership).toBeCalledWith(
    //   new GetDetailThread(useCasePayload)
    // );
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(
      useCasePayload.threadId,
    );
  });
});
