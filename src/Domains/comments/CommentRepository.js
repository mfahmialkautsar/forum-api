class CommentRepository {
  async getCommentsByThreadIdIgnoreRepliesOrderByDateAsc(threadId) {
    throw new Error('COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED');
  }

  async getCommentsByParentCommentIdIgnoreRepliesOrderByDateAsc(parentCommentId) {
    throw new Error('COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED');
  }

  async addComment(addComment) {
    throw new Error('COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED');
  }

  async addReply(addReply) {
    throw new Error('COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableComment(commentId) {
    throw new Error('COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner(verifyCommentOwner) {
    throw new Error('COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED');
  }

  async softDeleteComment(deleteComment) {
    throw new Error('COMMENT_REPOSITORY.MEHTOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentRepository;
