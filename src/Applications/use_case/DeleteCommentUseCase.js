const DeleteComment = require('#domains/comments/entities/DeleteComment');
const VerifyCommentOwner = require('#domains/comments/entities/VerifyCommentOwner');

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, credentialId } = useCasePayload;
    const deleteComment = new DeleteComment({
      id: commentId,
      threadId,
      credentialId,
    });
    await this._threadRepository.verifyAvailableThread(deleteComment.threadId);
    await this._commentRepository.verifyAvailableComment(
      deleteComment.id,
    );
    await this._commentRepository.verifyCommentOwner(
      new VerifyCommentOwner({
        commentId: deleteComment.id,
        credentialId: deleteComment.credentialId,
      }),
    );
    return this._commentRepository.softDeleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
