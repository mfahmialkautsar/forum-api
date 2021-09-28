const CommentRepository = require('#domains/comments/CommentRepository');
const DetailThread = require('#domains/threads/entities/DetailThread');
const ThreadRepository = require('#domains/threads/ThreadRepository');
const GetDetailThreadWithCommentsAndRepliesUseCase = require('../GetDetailThreadWithCommentsAndRepliesUseCase');

describe('GetDetailThreadWithCommentsAndRepliesUseCase', () => {
  it('should throw error when payload properties are not defined', async () => {
    // Arrange
    const useCasePayload = {
      threadId: undefined,
    };
    const expecteDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'The title',
      body: 'Hi mom!',
      username: 'bruce',
      date: new Date('2006-07-03T17:18:43+07:00'),
    });
    const expectedComments = [
      {
        id: 'comment-123',
        content: 'A commnet',
        username: 'bruce',
        date: new Date('2006-07-03 17:18:43 +0700'),
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        content: 'A commnet',
        username: 'bruce',
        date: new Date('2006-07-03 17:18:43 +0700'),
      },
    ];

    /** create use case dependency */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mock needed functions */
    mockThreadRepository.getDetailThreadByIdIgnoreComments = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expecteDetailThread));
    mockCommentRepository.getCommentsByThreadIdIgnoreRepliesOrderByDateAsc = jest.fn().mockImplementation(() => Promise.resolve(expectedComments));
    mockCommentRepository.getCommentsByParentCommentIdIgnoreRepliesOrderByDateAsc = jest.fn().mockImplementation(() => Promise.resolve(expectedReplies));

    const getDetailThreadWithCommentsAndRepliesUseCase = new GetDetailThreadWithCommentsAndRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      getDetailThreadWithCommentsAndRepliesUseCase.execute(useCasePayload),
    ).rejects.toThrowError(
      'GET_DETAIL_THREAD_WITH_COMMENTS_AND_REPLIES_USE_CASE.NOT_CONTAIN_THREAD_ID',
    );
  });

  it('should throw error when payload properties do not meet data types specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: { threadId: 'thread-123' },
    };
    const expecteDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'The title',
      body: 'Hi mom!',
      username: 'bruce',
      date: new Date('2006-07-03T17:18:43+07:00'),
    });
    const expectedComments = [
      {
        id: 'comment-123',
        content: 'A commnet',
        username: 'bruce',
        date: new Date('2006-07-03 17:18:43 +0700'),
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        content: 'A commnet',
        username: 'bruce',
        date: new Date('2006-07-03 17:18:43 +0700'),
      },
    ];

    /** create use case dependency */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mock needed functions */
    mockThreadRepository.getDetailThreadByIdIgnoreComments = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expecteDetailThread));
    mockCommentRepository.getCommentsByThreadIdIgnoreRepliesOrderByDateAsc = jest.fn().mockImplementation(() => Promise.resolve(expectedComments));
    mockCommentRepository.getCommentsByParentCommentIdIgnoreRepliesOrderByDateAsc = jest.fn().mockImplementation(() => Promise.resolve(expectedReplies));

    const getDetailThreadWithCommentsAndRepliesUseCase = new GetDetailThreadWithCommentsAndRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(
      getDetailThreadWithCommentsAndRepliesUseCase.execute(useCasePayload),
    ).rejects.toThrowError(
      'GET_DETAIL_THREAD_WITH_COMMENTS_AND_REPLIES_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPES_SPECIFICATION',
    );
  });

  it('should orchestrating the get detail thread with comments and replies action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const expecteDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'The title',
      body: 'Hi mom!',
      username: 'bruce',
      date: new Date('2006-07-03T17:18:43+07:00'),
    });
    const expectedComments = [
      {
        id: 'comment-123',
        content: '**komentar telah dihapus**',
        username: 'bruce',
        date: new Date('2006-07-03 17:18:43 +0700'),
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        content: '**balasan telah dihapus**',
        username: 'bruce',
        date: new Date('2006-07-03 17:18:43 +0700'),
      },
    ];

    /** create use case dependency */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mock needed functions */
    mockThreadRepository.getDetailThreadByIdIgnoreComments = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expecteDetailThread));
    mockCommentRepository.getCommentsByThreadIdIgnoreRepliesOrderByDateAsc = jest.fn().mockImplementation(() => Promise.resolve(
      expectedComments.map((expectedComment) => ({
        ...expectedComment,
        deleted_at: new Date('2006-07-03 17:18:44 +0700'),
      })),
    ));
    mockCommentRepository.getCommentsByParentCommentIdIgnoreRepliesOrderByDateAsc = jest.fn().mockImplementation(() => Promise.resolve(
      expectedReplies.map((expectedReply) => ({
        ...expectedReply,
        deleted_at: new Date('2006-07-03 17:18:44 +0700'),
      })),
    ));

    const getDetailThreadWithCommentsAndRepliesUseCase = new GetDetailThreadWithCommentsAndRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThreadWithCommentsAndRepliesUseCase = await getDetailThreadWithCommentsAndRepliesUseCase.execute(
      useCasePayload,
    );

    // Assert
    expect(detailThreadWithCommentsAndRepliesUseCase).toStrictEqual({
      ...expecteDetailThread,
      comments: [
        {
          ...expectedComments[0],
          replies: expectedReplies,
        },
      ],
    });
    expect(
      mockThreadRepository.getDetailThreadByIdIgnoreComments,
    ).toBeCalledWith(useCasePayload.threadId);
    expect(
      mockCommentRepository.getCommentsByThreadIdIgnoreRepliesOrderByDateAsc,
    ).toBeCalledWith(expecteDetailThread.id);
    expect(
      mockCommentRepository.getCommentsByThreadIdIgnoreRepliesOrderByDateAsc,
    ).toBeCalledTimes(expectedComments.length);
  });

  it('should orchestrating the get detail thread with no comments and no replies action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const expecteDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'The title',
      body: 'Hi mom!',
      username: 'bruce',
      date: new Date('2006-07-03T17:18:43+07:00'),
    });

    /** create use case dependency */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mock needed functions */
    mockThreadRepository.getDetailThreadByIdIgnoreComments = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expecteDetailThread));
    mockCommentRepository.getCommentsByThreadIdIgnoreRepliesOrderByDateAsc = jest.fn().mockImplementation(() => Promise.resolve());

    const getDetailThreadWithCommentsAndRepliesUseCase = new GetDetailThreadWithCommentsAndRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThreadWithCommentsAndRepliesUseCase = await getDetailThreadWithCommentsAndRepliesUseCase.execute(
      useCasePayload,
    );

    // Assert
    expect(detailThreadWithCommentsAndRepliesUseCase).toStrictEqual({
      ...expecteDetailThread,
    });
    expect(
      mockThreadRepository.getDetailThreadByIdIgnoreComments,
    ).toBeCalledWith(useCasePayload.threadId);
    expect(
      mockCommentRepository.getCommentsByThreadIdIgnoreRepliesOrderByDateAsc,
    ).toBeCalledWith(expecteDetailThread.id);
  });
});
