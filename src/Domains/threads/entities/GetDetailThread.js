class GetDetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, userId } = payload;

    this.threadId = threadId;
    this.userId = userId;
  }

  _verifyPayload({ threadId, userId }) {
    if (!threadId || !userId) {
      throw new Error('GET_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTIES');
    }

    if (typeof threadId !== 'string' || typeof userId !== 'string') {
      throw new Error('GET_DETAIL_THREAD.NOT_MEET_DATA_TYPES_SPECIFICATION');
    }
  }
}

module.exports = GetDetailThread;
