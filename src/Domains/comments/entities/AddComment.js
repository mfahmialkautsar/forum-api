class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      content, threadId, credentialId,
    } = payload;

    this.content = content;
    this.threadId = threadId;
    this.credentialId = credentialId;
  }

  _verifyPayload({
    content, threadId, credentialId,
  }) {
    if (!content || !threadId || !credentialId) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTIES');
    }

    if (
      typeof content !== 'string'
      || typeof threadId !== 'string'
      || typeof credentialId !== 'string'
    ) {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPES_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
