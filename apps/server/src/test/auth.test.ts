import request from 'supertest';
import app from '../index';
import './setup';

describe('Auth Endpoints', () => {
    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
    };

    describe('POST /api/auth/signup', () => {
        it('should register a new user and return token', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send(testUser);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.email).toBe(testUser.email);
            expect(res.body.user.name).toBe(testUser.name);
            expect(res.body.user).not.toHaveProperty('password');
        });

        it('should reject duplicate email', async () => {
            await request(app).post('/api/auth/signup').send(testUser);
            const res = await request(app).post('/api/auth/signup').send(testUser);

            expect(res.status).toBe(400);
            expect(res.body.message).toMatch(/already registered/i);
        });

        it('should reject missing required fields', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'test@example.com' });

            expect(res.status).toBe(400);
        });

        it('should reject invalid email format', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({ ...testUser, email: 'not-an-email' });

            expect(res.status).toBe(400);
        });

        it('should reject short password', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({ ...testUser, password: '123' });

            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/auth/signup').send(testUser);
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: testUser.email, password: testUser.password });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.email).toBe(testUser.email);
        });

        it('should reject wrong password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: testUser.email, password: 'wrongpass' });

            expect(res.status).toBe(401);
            expect(res.body.message).toMatch(/invalid credentials/i);
        });

        it('should reject non-existent user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'nope@example.com', password: 'password123' });

            expect(res.status).toBe(401);
        });

        it('should reject missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(res.status).toBe(400);
        });
    });
});
