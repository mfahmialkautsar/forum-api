const AddThread = require('#domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const threadInput = new AddThread(useCasePayload);
    return this._threadRepository.addThread(threadInput);
  }
}

module.exports = AddThreadUseCase;
