const DeleteComment = require('#domains/comments/entities/DeleteComment');
const VerifyCommentOwner = require('#domains/comments/entities/VerifyCommentOwner');

class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment({
      replacement: '**komentar telah dihapus**',
      ...useCasePayload,
    });
    await this._threadRepository.verifyAvailableThread(deleteComment.threadId);
    await this._commentRepository.verifyAvailableComment(deleteComment.commentId);
    await this._commentRepository.verifyCommentOwner(
      new VerifyCommentOwner({
        commentId: deleteComment.commentId,
        credentialId: deleteComment.credentialId,
      }),
    );
    return this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
