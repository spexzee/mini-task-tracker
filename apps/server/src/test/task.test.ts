import request from 'supertest';
import app from '../index';
import './setup';

describe('Task Endpoints', () => {
    let token: string;
    let token2: string;

    const getToken = async (
        name = 'User One',
        email = 'user1@example.com',
        password = 'password123',
    ): Promise<string> => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ name, email, password });
        return res.body.token;
    };

    beforeEach(async () => {
        token = await getToken();
        token2 = await getToken('User Two', 'user2@example.com', 'password456');
    });

    const createTask = (authToken: string, data: Record<string, unknown> = {}) =>
        request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Test task', ...data });

    describe('POST /api/tasks', () => {
        it('should create a task', async () => {
            const res = await createTask(token, {
                title: 'My task',
                description: 'Some description',
                dueDate: '2026-03-01',
            });

            expect(res.status).toBe(201);
            expect(res.body.title).toBe('My task');
            expect(res.body.description).toBe('Some description');
            expect(res.body.status).toBe('pending');
            expect(res.body).toHaveProperty('_id');
        });

        it('should reject task without title', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .set('Authorization', `Bearer ${token}`)
                .send({ description: 'no title' });

            expect(res.status).toBe(400);
        });

        it('should return 401 without token', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .send({ title: 'Nope' });

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/tasks', () => {
        it('should list tasks for the authenticated user', async () => {
            await createTask(token, { title: 'Task A' });
            await createTask(token, { title: 'Task B' });
            await createTask(token2, { title: 'Other Task' });

            const res = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
        });

        it('should return 401 without token', async () => {
            const res = await request(app).get('/api/tasks');
            expect(res.status).toBe(401);
        });
    });

    describe('PUT /api/tasks/:id', () => {
        it('should update a task', async () => {
            const created = await createTask(token, { title: 'Original' });
            const taskId = created.body._id;

            const res = await request(app)
                .put(`/api/tasks/${taskId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Updated', status: 'completed' });

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Updated');
            expect(res.body.status).toBe('completed');
        });

        it('should return 404 for another user\'s task', async () => {
            const created = await createTask(token, { title: 'Private' });
            const taskId = created.body._id;

            const res = await request(app)
                .put(`/api/tasks/${taskId}`)
                .set('Authorization', `Bearer ${token2}`)
                .send({ title: 'Stolen' });

            expect(res.status).toBe(404);
        });

        it('should return 401 without token', async () => {
            const res = await request(app)
                .put('/api/tasks/fakeid')
                .send({ title: 'Nope' });

            expect(res.status).toBe(401);
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        it('should delete a task', async () => {
            const created = await createTask(token, { title: 'ToDelete' });
            const taskId = created.body._id;

            const res = await request(app)
                .delete(`/api/tasks/${taskId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/deleted/i);

            // Verify it's gone
            const list = await request(app)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${token}`);
            expect(list.body).toHaveLength(0);
        });

        it('should return 404 for another user\'s task', async () => {
            const created = await createTask(token, { title: 'Private' });
            const taskId = created.body._id;

            const res = await request(app)
                .delete(`/api/tasks/${taskId}`)
                .set('Authorization', `Bearer ${token2}`);

            expect(res.status).toBe(404);
        });

        it('should return 401 without token', async () => {
            const res = await request(app).delete('/api/tasks/fakeid');
            expect(res.status).toBe(401);
        });
    });
});
