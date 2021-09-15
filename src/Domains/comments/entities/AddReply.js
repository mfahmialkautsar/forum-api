class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      content, parentCommentId, credentialId,
    } = payload;

    this.content = content;
    this.parentCommentId = parentCommentId;
    this.credentialId = credentialId;
  }

  _verifyPayload({
    content, parentCommentId, credentialId,
  }) {
    if (!content || !parentCommentId || !credentialId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTIES');
    }

    if (
      typeof content !== 'string'
      || typeof parentCommentId !== 'string'
      || typeof credentialId !== 'string'
    ) {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPES_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
