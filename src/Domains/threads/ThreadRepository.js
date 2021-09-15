class ThreadRepository {
  async addThread(addUser) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyAvailableThread(threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // async verifyOwnership(getDetailThread) {
  //   throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  // }

  // async getThreadById(id) {
  //   throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  // }

  async getDetailThreadById(threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadRepository;
