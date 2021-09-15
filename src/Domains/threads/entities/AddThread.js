class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, credentialId } = payload;

    this.title = title;
    this.body = body;
    this.credentialId = credentialId;
  }

  _verifyPayload({ title, body, credentialId }) {
    if (!title || !body || !credentialId) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTIES');
    }

    if (
      typeof title !== 'string'
      || typeof body !== 'string'
      || typeof credentialId !== 'string'
    ) {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPES_SPECIFICATION');
    }
  }
}

module.exports = AddThread;
