class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      replacement, threadId, commentId, credentialId,
    } = payload;

    this.replacement = replacement;
    this.threadId = threadId;
    this.commentId = commentId;
    this.credentialId = credentialId;
  }

  _verifyPayload({
    replacement, threadId, commentId, credentialId,
  }) {
    if (!replacement || !threadId || !commentId || !credentialId) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTIES');
    }

    if (typeof replacement !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPES_SPECIFICATION');
    }
  }
}

module.exports = DeleteComment;
