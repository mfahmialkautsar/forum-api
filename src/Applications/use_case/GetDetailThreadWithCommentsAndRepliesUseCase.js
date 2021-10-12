class GetDetailThreadWithCommentsAndRepliesUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
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
      const likeCountsPromieses = [];

      comments.forEach((comment) => {
        likeCountsPromieses.push(
          this._likeRepository.getLikeCountsByCommentId(comment.id),
        );
        repliesPromises.push(
          this._commentRepository.getCommentsByParentCommentIdIgnoreRepliesOrderByDateAsc(
            comment.id,
          ),
        );
      });

      const replies = await Promise.all(repliesPromises);
      const likeCounts = await Promise.all(likeCountsPromieses);

      const getModifiedReplies = (i) => replies[i].map(
        ({
          id, content, username, date, deleted_at: deletedAt,
        }) => ({
          id,
          content: deletedAt ? '**balasan telah dihapus**' : content,
          username,
          date,
        }),
      );

      comments = comments.map(
        ({
          id, content, username, date, deleted_at: deletedAt,
        }, i) => ({
          id,
          content: deletedAt ? '**komentar telah dihapus**' : content,
          username,
          date,
          replies: getModifiedReplies(i),
          likeCount: parseInt(likeCounts[i], 10),
        }),
      );

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
