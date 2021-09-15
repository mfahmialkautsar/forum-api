const CommentRepository = require('#domains/comments/CommentRepository');
const DeleteReply = require('#domains/comments/entities/DeleteReply');
const VerifyCommentOwner = require('#domains/comments/entities/VerifyCommentOwner');
const ThreadRepository = require('#domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      credentialId: 'user-123',
    };

    /** create dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mock needed functions */
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** create use case instance */
    const deleteCommentUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.commentId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.replyId,
    );
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
      new VerifyCommentOwner({
        commentId: useCasePayload.replyId,
        credentialId: useCasePayload.credentialId,
      }),
    );
    expect(mockCommentRepository.deleteReply).toHaveBeenCalledWith(
      new DeleteReply({
        threadId: useCasePayload.threadId,
        parentCommentId: useCasePayload.commentId,
        replyId: useCasePayload.replyId,
        credentialId: useCasePayload.credentialId,
      }),
    );
  });
});
