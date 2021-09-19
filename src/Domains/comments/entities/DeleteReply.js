class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      replacement, threadId, parentCommentId, replyId, credentialId,
    } = payload;

    this.replacement = replacement;
    this.threadId = threadId;
    this.parentCommentId = parentCommentId;
    this.replyId = replyId;
    this.credentialId = credentialId;
  }

  _verifyPayload({
    replacement, threadId, parentCommentId, replyId, credentialId,
  }) {
    if (!replacement || !threadId || !parentCommentId || !replyId || !credentialId) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTIES');
    }

    if (
      typeof replacement !== 'string'
      || typeof threadId !== 'string'
      || typeof parentCommentId !== 'string'
      || typeof replyId !== 'string'
      || typeof credentialId !== 'string'
    ) {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPES_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
