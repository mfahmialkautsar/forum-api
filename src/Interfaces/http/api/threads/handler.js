const AddCommentUseCase = require('#applications/use_case/AddCommentUseCase');
const AddReplyUseCase = require('#applications/use_case/AddReplyUseCase');
const AddThreadUseCase = require('#applications/use_case/AddThreadUseCase');
const DeleteCommentUseCase = require('#applications/use_case/DeleteCommentUseCase');
const DeleteReplyUseCase = require('#applications/use_case/DeleteReplyUseCase');
const GetDetailThreadWithCommentsAndRepliesUseCase = require('#applications/use_case/GetDetailThreadWithCommentsAndRepliesUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdWithCommentsAndRepliesHandler = this.getThreadByIdWithCommentsAndRepliesHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postThreadHandler(req, h) {
    const { id: credentialId } = req.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({
      ...req.payload,
      credentialId,
    });

    const res = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });

    res.code(201);
    return res;
  }

  async getThreadByIdWithCommentsAndRepliesHandler(req) {
    const { threadId } = req.params;
    const getDetailThreadByIdWithCommentsAndRepliesUseCase = this._container.getInstance(
      GetDetailThreadWithCommentsAndRepliesUseCase.name,
    );
    const thread = await getDetailThreadByIdWithCommentsAndRepliesUseCase.execute({
      threadId,
    });

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  async postCommentHandler(req, h) {
    const { id: credentialId } = req.auth.credentials;
    const { threadId } = req.params;
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name,
    );
    const addedComment = await addCommentUseCase.execute({
      ...req.payload,
      threadId,
      credentialId,
    });

    const res = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    res.code(201);
    return res;
  }

  async deleteCommentHandler(req) {
    const { id: credentialId } = req.auth.credentials;
    const { threadId, commentId } = req.params;
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name,
    );
    await deleteCommentUseCase.execute({
      threadId,
      commentId,
      credentialId,
    });

    return { status: 'success' };
  }

  async postReplyHandler(req, h) {
    const { id: credentialId } = req.auth.credentials;
    const { threadId, commentId } = req.params;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({
      ...req.payload,
      threadId,
      commentId,
      credentialId,
    });

    const res = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    res.code(201);
    return res;
  }

  async deleteReplyHandler(req) {
    const { id: credentialId } = req.auth.credentials;
    const { threadId, commentId, replyId } = req.params;
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name,
    );
    await deleteReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      credentialId,
    });

    return { status: 'success' };
  }
}

module.exports = ThreadsHandler;
