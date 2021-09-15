class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, commentId, credentialId } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.credentialId = credentialId;
  }

  _verifyPayload({ threadId, commentId, credentialId }) {
    if (!threadId || !commentId || !credentialId) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTIES');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPES_SPECIFICATION');
    }
  }
}

module.exports = DeleteComment;
