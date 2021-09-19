const CommentRepository = require('#domains/comments/CommentRepository');
const DeleteComment = require('#domains/comments/entities/DeleteComment');
const VerifyCommentOwner = require('#domains/comments/entities/VerifyCommentOwner');
const ThreadRepository = require('#domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      replacement: '**komentar telah dihapus**',
      threadId: 'thread-123',
      commentId: 'comment-123',
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
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** create use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
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
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
      new VerifyCommentOwner({
        commentId: useCasePayload.commentId,
        credentialId: useCasePayload.credentialId,
      }),
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      new DeleteComment({
        replacement: useCasePayload.replacement,
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        credentialId: useCasePayload.credentialId,
      }),
    );
  });
});
