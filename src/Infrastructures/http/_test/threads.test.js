const container = require('#infrastructures/container');
const pool = require('#infrastructures/database/postgres/pool');
const CommentsTableTestHelper = require('#tests/CommentsTableTestHelper');
const ServerTestHelper = require('#tests/ServerTestHelper');
const ThreadsTableTestHelper = require('#tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('#tests/UsersTableTestHelper');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 401 when user not logged in', async () => {
      // Arrange
      const payload = {
        title: 'The title',
        body: 'Hi mom!',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed properties', async () => {
      // Arrange
      const payload = {
        title: 'The title',
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload not meet data types specification', async () => {
      // Arrange
      const payload = {
        title: 'The title',
        body: { body: 'Hi mom!' },
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      );
    });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const payload = {
        title: 'The title',
        body: 'Hi mom!',
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    describe('POST /threads/{threadId}/comments', () => {
      it('should response 401 when user not logged in', async () => {
        // Arrange
        const payload = {
          content: 'A comment',
        };
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads/thread-123/comments',
          payload,
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(401);
        expect(responseJson.message).toEqual('Missing authentication');
      });

      it('should response 404 when thread not found', async () => {
        // Arrange
        const payload = {
          content: 'A comment',
        };
        const accessToken = await ServerTestHelper.getAccessToken();
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads/thread-123/comments',
          payload,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('thread tidak ditemukan');
      });

      it('should response 400 when request payload not contain needed properties', async () => {
        // Arrange
        const payload = {};
        const accessToken = await ServerTestHelper.getAccessToken();
        await ThreadsTableTestHelper.addThread({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads/thread-123/comments',
          payload,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(400);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual(
          'tidak dapat menambahkan comment baru karena properti yang dibutuhkan tidak ada',
        );
      });

      it('should response 400 when request payload not meet data types specification', async () => {
        // Arrange
        const payload = {
          content: true,
        };
        const accessToken = await ServerTestHelper.getAccessToken();
        await ThreadsTableTestHelper.addThread({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads/thread-123/comments',
          payload,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(400);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual(
          'tidak dapat menambahkan comment baru karena tipe data tidak sesuai',
        );
      });

      it('should response 201 and persisted comment', async () => {
        // Arrange
        const payload = {
          content: 'A comment',
        };
        const accessToken = await ServerTestHelper.getAccessToken();
        await ThreadsTableTestHelper.addThread({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads/thread-123/comments',
          payload,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(201);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.data.addedComment).toBeDefined();
        expect(responseJson.data.addedComment.content).toEqual(payload.content);
      });

      describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 401 when user not logged in', async () => {
          // Arrange
          const payload = {
            content: 'A comment',
          };
          await UsersTableTestHelper.addUser({});
          await ThreadsTableTestHelper.addThread({});
          await CommentsTableTestHelper.addComment({});
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/threads/thread-123/comments/comment-123/replies',
            payload,
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(401);
          expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 404 when thread not found', async () => {
          // Arrange
          const payload = {
            content: 'A comment',
          };
          const accessToken = await ServerTestHelper.getAccessToken();
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/threads/thread-123/comments/comment-123/replies',
            payload,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        });
        it('should response 404 when comment not found', async () => {
          // Arrange
          const payload = {
            content: 'A comment',
          };
          const accessToken = await ServerTestHelper.getAccessToken();
          await ThreadsTableTestHelper.addThread({});
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/threads/thread-123/comments/comment-123/replies',
            payload,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(404);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual('comment tidak ditemukan');
        });

        it('should response 400 when request payload not contain needed properties', async () => {
          // Arrange
          const payload = {};
          const accessToken = await ServerTestHelper.getAccessToken();
          await ThreadsTableTestHelper.addThread({});
          await CommentsTableTestHelper.addComment({});
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/threads/thread-123/comments/comment-123/replies',
            payload,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(400);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual(
            'tidak dapat menambahkan reply baru karena properti yang dibutuhkan tidak ada',
          );
        });

        it('should response 400 when request payload not meet data types specification', async () => {
          // Arrange
          const payload = {
            content: true,
          };
          const accessToken = await ServerTestHelper.getAccessToken();
          await ThreadsTableTestHelper.addThread({});
          await CommentsTableTestHelper.addComment({});
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/threads/thread-123/comments/comment-123/replies',
            payload,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(400);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual(
            'tidak dapat menambahkan reply baru karena tipe data tidak sesuai',
          );
        });

        it('should response 201 and persisted reply', async () => {
          // Arrange
          const payload = {
            content: 'A comment',
          };
          const accessToken = await ServerTestHelper.getAccessToken();
          await ThreadsTableTestHelper.addThread({});
          await CommentsTableTestHelper.addComment({});
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/threads/thread-123/comments/comment-123/replies',
            payload,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(201);
          expect(responseJson.status).toEqual('success');
          expect(responseJson.data.addedReply).toBeDefined();
          expect(responseJson.data.addedReply.content).toEqual(payload.content);
        });
      });
    });
  });

  describe('when GET /threads', () => {
    describe('GET /threads/{threadId}', () => {
      it('should response 404 when thread not found', async () => {
        // Arrange
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'GET',
          url: '/threads/thread-123',
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('thread tidak ditemukan');
      });

      it('should response 200 and detail thread with comments and replies', async () => {
        // Arrange
        const userPayload = {
          username: 'bruce',
        };
        const threadPayload = {
          id: 'thread-123',
        };
        const expectedDetailThread = {
          id: threadPayload.id,
          title: 'The title',
          body: 'Hi mom!',
          username: userPayload.username,
          date: new Date('2006-07-03 17:18:43 +0700').toISOString(),
          comments: [
            {
              id: 'comment-123',
              content: 'A commnet',
              username: 'bruce',
              date: new Date('2006-07-03 17:18:43 +0700').toISOString(),
              likeCount: 0,
              replies: [
                {
                  id: 'reply-123',
                  content: 'A commnet',
                  username: 'bruce',
                  date: new Date('2006-07-03 17:18:43 +0700').toISOString(),
                },
              ],
            },
          ],
        };
        await UsersTableTestHelper.addUser(userPayload);
        await ThreadsTableTestHelper.addThread(threadPayload);
        await CommentsTableTestHelper.addComment({});
        await CommentsTableTestHelper.addReply({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'GET',
          url: '/threads/thread-123',
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.data.thread).toBeDefined();
        expect(responseJson.data.thread).toStrictEqual(expectedDetailThread);
      });
    });
  });

  describe('when DELETE /threads', () => {
    describe('DELETE /threads/{threadId}/comments/{commentId}', () => {
      it('should response 401 when user not logged in', async () => {
        // Arrange
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123',
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(401);
        expect(responseJson.message).toEqual('Missing authentication');
      });

      it("should response 403 when user tries to delete somebody's comment", async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        await UsersTableTestHelper.addUser({
          id: 'user-321',
          username: 'wayne',
        });
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({ credentialId: 'user-321' });
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(403);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual(
          'anda tidak berhak mengakses resource ini',
        );
      });

      it('should response 404 when thread not found', async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('thread tidak ditemukan');
      });

      it('should response 404 when comment not found', async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        await ThreadsTableTestHelper.addThread({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('comment tidak ditemukan');
      });

      it("should response 403 when user tries to delete somebody's reply", async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        await UsersTableTestHelper.addUser({
          id: 'user-321',
          username: 'wayne',
        });
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({ credentialId: 'user-321' });
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(403);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual(
          'anda tidak berhak mengakses resource ini',
        );
      });

      it('should response 200', async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual('success');
      });
    });

    describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
      it('should response 401 when user not logged in', async () => {
        // Arrange
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(401);
        expect(responseJson.message).toEqual('Missing authentication');
      });

      it('should response 404 when thread not found', async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123/replies/reply-123',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('thread tidak ditemukan');
      });

      it('should response 404 when comment not found', async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        await ThreadsTableTestHelper.addThread({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123/replies/reply-123',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('comment tidak ditemukan');
      });

      it('should response 404 when reply not found', async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123/replies/reply-123',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('comment tidak ditemukan');
      });

      it("should response 403 when user tries to delete somebody's reply", async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        await UsersTableTestHelper.addUser({
          id: 'user-321',
          username: 'wayne',
        });
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        await CommentsTableTestHelper.addReply({ credentialId: 'user-321' });
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123/replies/reply-123',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(403);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual(
          'anda tidak berhak mengakses resource ini',
        );
      });

      it('should response 200', async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        await CommentsTableTestHelper.addReply({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/thread-123/comments/comment-123/replies/reply-123',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual('success');
      });
    });
  });

  describe('when PUT /threads', () => {
    describe('PUT /threads/{threadId}/comments/{commentId}/likes', () => {
      it('should response 401 when user not logged in', async () => {
        // Arrange
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: '/threads/thread-123/comments/comment-123/likes',
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(401);
        expect(responseJson.message).toEqual('Missing authentication');
      });

      it('should response 404 when thread not found', async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: '/threads/thread-123/comments/comment-123/likes',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('thread tidak ditemukan');
      });

      it('should response 404 when comment not found', async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        await ThreadsTableTestHelper.addThread({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: '/threads/thread-123/comments/comment-123/likes',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('comment tidak ditemukan');
      });

      it('should resopnse 200', async () => {
        // Arrange
        const accessToken = await ServerTestHelper.getAccessToken();
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: '/threads/thread-123/comments/comment-123/likes',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual('success');
      });
    });
  });
});
