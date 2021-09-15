const CommentRepository = require('#domains/comments/CommentRepository');
const AddComment = require('#domains/comments/entities/AddComment');
const AddedComment = require('#domains/comments/entities/AddedComment');
const ThreadRepository = require('#domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'A commnet',
      credentialId: 'user-123',
    };
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
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
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    /** create use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment(useCasePayload),
    );
  });
});
