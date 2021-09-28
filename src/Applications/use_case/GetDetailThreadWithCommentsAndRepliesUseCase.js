class GetDetailThreadWithCommentsAndRepliesUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getDetailThreadByIdIgnoreComments(threadId);
    let comments = await this._commentRepository.getCommentsByThreadIdIgnoreRepliesOrderByDateAsc(
      thread.id,
    );

    let threadWithCommentsAndReplies = { ...thread };

    if (comments) {
      const repliesPromises = [];
      comments.forEach((comment) => {
        repliesPromises.push(
          this._commentRepository.getCommentsByParentCommentIdIgnoreRepliesOrderByDateAsc(
            comment.id,
          ),
        );
      });
      const replies = await Promise.all(repliesPromises);

      comments = comments.map(({
        id, content, username, date, deleted_at: deletedAt,
      }, i) => ({
        id,
        content: deletedAt
          ? '**komentar telah dihapus**'
          : content,
        username,
        date,
        replies: replies[i].map(({
          // eslint-disable-next-line no-shadow
          id, content, username, date, deleted_at: deletedAt,
        }) => ({
          id,
          content: deletedAt
            ? '**balasan telah dihapus**'
            : content,
          username,
          date,
        })),
      }));

      threadWithCommentsAndReplies = {
        ...threadWithCommentsAndReplies,
        comments,
      };
    }

    return threadWithCommentsAndReplies;
  }

  _verifyPayload(payload) {
    const { threadId } = payload;

    if (!threadId) {
      throw new Error(
        'GET_DETAIL_THREAD_WITH_COMMENTS_AND_REPLIES_USE_CASE.NOT_CONTAIN_THREAD_ID',
      );
    }

    if (typeof threadId !== 'string') {
      throw new Error(
        'GET_DETAIL_THREAD_WITH_COMMENTS_AND_REPLIES_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPES_SPECIFICATION',
      );
    }
  }
}

module.exports = GetDetailThreadWithCommentsAndRepliesUseCase;
