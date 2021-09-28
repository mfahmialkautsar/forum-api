const DeleteReply = require('#domains/comments/entities/DeleteReply');
const VerifyCommentOwner = require('#domains/comments/entities/VerifyCommentOwner');

class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const {
      threadId, commentId, replyId, credentialId,
    } = useCasePayload;
    const deleteReply = new DeleteReply({
      id: replyId,
      threadId,
      parentCommentId: commentId,
      credentialId,
    });
    await this._threadRepository.verifyAvailableThread(deleteReply.threadId);
    await this._commentRepository.verifyAvailableComment(deleteReply.parentCommentId);
    await this._commentRepository.verifyAvailableComment(deleteReply.id);
    await this._commentRepository.verifyCommentOwner(
      new VerifyCommentOwner({
        commentId: deleteReply.id,
        credentialId: deleteReply.credentialId,
      }),
    );
    return this._commentRepository.softDeleteComment(deleteReply);
  }
}

module.exports = DeleteReplyUseCase;
