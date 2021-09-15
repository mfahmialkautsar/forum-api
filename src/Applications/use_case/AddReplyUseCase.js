const AddReply = require('#domains/comments/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({
    threadId, commentId, content, credentialId,
  }) {
    const addReply = new AddReply({
      content,
      parentCommentId: commentId,
      credentialId,
    });
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(
      addReply.parentCommentId,
    );
    return this._commentRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
