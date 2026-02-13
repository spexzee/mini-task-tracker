import User from '../models/user.model';
import './setup';

describe('User Model', () => {
    const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
    };

    describe('Password hashing', () => {
        it('should hash the password on save', async () => {
            const user = await User.create(validUser);
            expect(user.password).not.toBe(validUser.password);
            expect(user.password.length).toBeGreaterThan(20);
        });

        it('should not re-hash if password is not modified', async () => {
            const user = await User.create(validUser);
            const hashedPassword = user.password;

            user.name = 'Jane Doe';
            await user.save();

            expect(user.password).toBe(hashedPassword);
        });
    });

    describe('comparePassword', () => {
        it('should return true for correct password', async () => {
            const user = await User.create(validUser);
            const result = await user.comparePassword('password123');
            expect(result).toBe(true);
        });

        it('should return false for wrong password', async () => {
            const user = await User.create(validUser);
            const result = await user.comparePassword('wrongpassword');
            expect(result).toBe(false);
        });
    });

    describe('Validation', () => {
        it('should require name', async () => {
            await expect(
                User.create({ email: 'a@b.com', password: '123456' }),
            ).rejects.toThrow(/name/i);
        });

        it('should require email', async () => {
            await expect(
                User.create({ name: 'Test', password: '123456' }),
            ).rejects.toThrow(/email/i);
        });

        it('should require password', async () => {
            await expect(
                User.create({ name: 'Test', email: 'a@b.com' }),
            ).rejects.toThrow(/password/i);
        });

        it('should reject invalid email', async () => {
            await expect(
                User.create({ ...validUser, email: 'not-valid' }),
            ).rejects.toThrow();
        });

        it('should reject short password (< 6 chars)', async () => {
            await expect(
                User.create({ ...validUser, password: '123' }),
            ).rejects.toThrow(/6 characters/i);
        });

        it('should reject short name (< 2 chars)', async () => {
            await expect(
                User.create({ ...validUser, name: 'A' }),
            ).rejects.toThrow(/2 characters/i);
        });
    });

    describe('toJSON', () => {
        it('should exclude password from JSON output', async () => {
            const user = await User.create(validUser);
            const json = user.toJSON();
            expect(json).not.toHaveProperty('password');
        });
    });
});
