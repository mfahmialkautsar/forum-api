class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, credentialId } = useCasePayload;
    const likePayload = { commentId, credentialId };

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    const likeAvailability = await this._likeRepository.isLikeByCommentIdAndOwnerAvailable(
      likePayload,
    );

    if (likeAvailability) {
      await this._likeRepository.deleteLikeByCommentIdAndOwner(likePayload);
    } else {
      await this._likeRepository.addLikeByCommentId(likePayload);
    }
  }
}

module.exports = LikeCommentUseCase;
