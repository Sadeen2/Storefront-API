import { UserStore } from '../../models/user';

const store = new UserStore();

describe('User Model', () => {
    let createdUserId: number;

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have an authenticate method', () => {
        expect(store.authenticate).toBeDefined();
    });

    it('create method should add a user', async () => {
        const result = await store.create({
            username: 'test_user',
            firstname: 'Test',
            lastname: 'User',
            password: 'password123'
        });
        createdUserId = result.id as number;
        expect(result.username).toEqual('test_user');
        expect(result.firstname).toEqual('Test');
        expect(result.lastname).toEqual('User');
    });

    it('index method should return a list of users', async () => {
        const result = await store.index();
        expect(result.length).toBeGreaterThan(0);
    });

    it('show method should return the correct user', async () => {
        const result = await store.show(createdUserId);
        expect(result.id).toEqual(createdUserId);
        expect(result.username).toEqual('test_user');
    });

    it('authenticate method should return user with correct credentials', async () => {
        const result = await store.authenticate('test_user', 'password123');
        expect(result).not.toBeNull();
        expect(result?.username).toEqual('test_user');
    });

    it('authenticate method should return null with wrong credentials', async () => {
        const result = await store.authenticate('test_user', 'wrongpassword');
        expect(result).toBeNull();
    });
});
