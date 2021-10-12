const CommentRepository = require('#domains/comments/CommentRepository');
const LikeRepository = require('#domains/likes/LikeRepository');
const ThreadRepository = require('#domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating add like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      credentialId: 'user-123',
    };
    const likeRepositoryPayload = {
      commentId: useCasePayload.commentId,
      credentialId: useCasePayload.credentialId,
    };

    /** create dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mock needed functions */
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.isLikeByCommentIdAndOwnerAvailable = jest.fn(() => Promise.resolve(0));
    mockLikeRepository.addLikeByCommentId = jest.fn(() => Promise.resolve());

    /** create use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.commentId,
    );
    expect(
      mockLikeRepository.isLikeByCommentIdAndOwnerAvailable,
    ).toHaveBeenCalledWith(likeRepositoryPayload);
    expect(mockLikeRepository.addLikeByCommentId).toHaveBeenCalledWith(
      likeRepositoryPayload,
    );
  });

  it('should orchestrating delete like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      credentialId: 'user-123',
    };
    const likeRepositoryPayload = {
      commentId: useCasePayload.commentId,
      credentialId: useCasePayload.credentialId,
    };

    /** create dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mock needed functions */
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.isLikeByCommentIdAndOwnerAvailable = jest.fn(() => Promise.resolve(1));
    mockLikeRepository.deleteLikeByCommentIdAndOwner = jest.fn(() => Promise.resolve());

    /** create use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.commentId,
    );
    expect(
      mockLikeRepository.isLikeByCommentIdAndOwnerAvailable,
    ).toHaveBeenCalledWith(likeRepositoryPayload);
    expect(mockLikeRepository.deleteLikeByCommentIdAndOwner).toHaveBeenCalledWith(
      likeRepositoryPayload,
    );
  });
});
