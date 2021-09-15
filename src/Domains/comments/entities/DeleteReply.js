class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      threadId, parentCommentId, replyId, credentialId,
    } = payload;

    this.threadId = threadId;
    this.parentCommentId = parentCommentId;
    this.replyId = replyId;
    this.credentialId = credentialId;
  }

  _verifyPayload({
    threadId, parentCommentId, replyId, credentialId,
  }) {
    if (!threadId || !parentCommentId || !replyId || !credentialId) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTIES');
    }

    if (
      typeof threadId !== 'string'
      || typeof parentCommentId !== 'string'
      || typeof replyId !== 'string'
      || typeof credentialId !== 'string'
    ) {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPES_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
