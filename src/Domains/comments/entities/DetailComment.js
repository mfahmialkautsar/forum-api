class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, replies,
    } = payload;

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.replies = replies;
  }

  _verifyPayload({
    id, content, date, username, replies,
  }) {
    if (!id || !content || !date || !username) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTIES');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'object'
      || typeof username !== 'string'
      || (replies && typeof replies !== 'object')
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPES_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
