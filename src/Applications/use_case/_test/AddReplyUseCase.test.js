const CommentRepository = require('#domains/comments/CommentRepository');
const AddReply = require('#domains/comments/entities/AddReply');
const AddedComment = require('#domains/comments/entities/AddedComment');
const ThreadRepository = require('#domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'A commnet',
      credentialId: 'user-123',
    };
    const expectedAddedComment = new AddedComment({
      id: 'reply-123',
      content: 'A comment',
      owner: 'user-123',
    });

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
    mockCommentRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    /** create use case instance */
    const addReply = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addReply.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockCommentRepository.addReply).toBeCalledWith(
      new AddReply({
        content: useCasePayload.content,
        parentCommentId: useCasePayload.commentId,
        credentialId: useCasePayload.credentialId,
      }),
    );
  });
});
