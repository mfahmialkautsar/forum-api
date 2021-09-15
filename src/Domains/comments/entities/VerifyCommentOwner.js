class VerifyCommentOwner {
  constructor(payload) {
    this._verifyPayload(payload);

    const { commentId, credentialId } = payload;

    this.commentId = commentId;
    this.credentialId = credentialId;
  }

  _verifyPayload({ commentId, credentialId }) {
    if (!commentId || !credentialId) {
      throw new Error('VERIFY_COMMENT_OWNER.NOT_CONTAIN_NEEDED_PROPERTIES');
    }

    if (typeof commentId !== 'string' || typeof credentialId !== 'string') {
      throw new Error('VERIFY_COMMENT_OWNER.NOT_MEET_DATA_TYPES_SPECIFICATION');
    }
  }
}

module.exports = VerifyCommentOwner;
