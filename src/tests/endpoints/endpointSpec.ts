import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);
let token: string;
let userId: number;
let productId: number;
let orderId: number;

describe('User Endpoints', () => {
    it('POST /users - creates a new user and returns token', async () => {
        const res = await request.post('/users').send({
            username: 'endpoint_test_user',
            firstname: 'Endpoint',
            lastname: 'Tester',
            password: 'testpassword'
        });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        token = res.body.token;
        userId = res.body.user.id;
    });

    it('POST /users/authenticate - returns token for valid credentials', async () => {
        const res = await request.post('/users/authenticate').send({
            username: 'endpoint_test_user',
            password: 'testpassword'
        });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('POST /users/authenticate - returns 401 for invalid credentials', async () => {
        const res = await request.post('/users/authenticate').send({
            username: 'endpoint_test_user',
            password: 'wrongpassword'
        });
        expect(res.status).toBe(401);
    });

    it('GET /users - returns list of users with valid token', async () => {
        const res = await request
            .get('/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /users - returns 401 without token', async () => {
        const res = await request.get('/users');
        expect(res.status).toBe(401);
    });

    it('GET /users/:id - returns user by id', async () => {
        const res = await request
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toEqual(userId);
    });
});

describe('Product Endpoints', () => {
    it('POST /products - creates a product (requires auth)', async () => {
        const res = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Endpoint Test Widget',
                price: 29.99,
                category: 'testing'
            });
        expect(res.status).toBe(200);
        expect(res.body.name).toEqual('Endpoint Test Widget');
        productId = res.body.id;
    });

    it('POST /products - returns 401 without auth', async () => {
        const res = await request.post('/products').send({
            name: 'No Auth Widget',
            price: 5.00
        });
        expect(res.status).toBe(401);
    });

    it('GET /products - returns list of products', async () => {
        const res = await request.get('/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /products/:id - returns a product', async () => {
        const res = await request.get(`/products/${productId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toEqual(productId);
    });

    it('GET /products/category/:category - returns products by category', async () => {
        const res = await request.get('/products/category/testing');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('PUT /products/:id - updates a product (requires auth)', async () => {
        const res = await request
            .put(`/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated Widget', price: 39.99, category: 'testing' });
        expect(res.status).toBe(200);
        expect(res.body.name).toEqual('Updated Widget');
    });
});

describe('Order Endpoints', () => {
    it('POST /orders - creates an order (requires auth)', async () => {
        const res = await request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ user_id: userId, status: 'active' });
        expect(res.status).toBe(200);
        expect(res.body.status).toEqual('active');
        orderId = res.body.id;
    });

    it('POST /orders - returns 401 without auth', async () => {
        const res = await request
            .post('/orders')
            .send({ user_id: userId, status: 'active' });
        expect(res.status).toBe(401);
    });

    it('GET /orders - returns list of orders (requires auth)', async () => {
        const res = await request
            .get('/orders')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /orders/:id/products - adds a product to an order', async () => {
        const res = await request
            .post(`/orders/${orderId}/products`)
            .set('Authorization', `Bearer ${token}`)
            .send({ product_id: productId, quantity: 3 });
        expect(res.status).toBe(200);
        expect(res.body.quantity).toEqual(3);
    });

    it('GET /orders/:id - returns order with products', async () => {
        const res = await request
            .get(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.products).toBeDefined();
    });

    it('GET /orders/user/:id/current - returns current active order', async () => {
        const res = await request
            .get(`/orders/user/${userId}/current`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    it('GET /orders/user/:id/completed - returns completed orders', async () => {
        const res = await request
            .get(`/orders/user/${userId}/completed`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('DELETE /orders/:id - deletes an order (requires auth)', async () => {
        const res = await request
            .delete(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
});
