class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, threadId, parentCommentId, credentialId,
    } = payload;

    this.id = id;
    this.threadId = threadId;
    this.parentCommentId = parentCommentId;
    this.credentialId = credentialId;
  }

  _verifyPayload({
    id, threadId, parentCommentId, credentialId,
  }) {
    if (!id || !threadId || !parentCommentId || !credentialId) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTIES');
    }

    if (
      typeof id !== 'string'
      || typeof threadId !== 'string'
      || typeof parentCommentId !== 'string'
      || typeof credentialId !== 'string'
    ) {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPES_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
