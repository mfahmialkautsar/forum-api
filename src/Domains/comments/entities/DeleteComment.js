class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, threadId, credentialId,
    } = payload;

    this.id = id;
    this.threadId = threadId;
    this.credentialId = credentialId;
  }

  _verifyPayload({
    id, threadId, credentialId,
  }) {
    if (!id || !threadId || !credentialId) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTIES');
    }

    if (typeof id !== 'string' || typeof threadId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPES_SPECIFICATION');
    }
  }
}

module.exports = DeleteComment;
