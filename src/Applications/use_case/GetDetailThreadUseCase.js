class GetDetailThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    return this._threadRepository.getDetailThreadById(threadId);
  }
}

module.exports = GetDetailThreadUseCase;
