import { OrderStore } from '../../models/order';
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Order Model', () => {
    let testUserId: number;
    let testProductId: number;
    let createdOrderId: number;

    beforeAll(async () => {
        // Create test user and product
        const user = await userStore.create({
            username: 'order_test_user',
            firstname: 'Order',
            lastname: 'Tester',
            password: 'password123'
        });
        testUserId = user.id as number;

        const product = await productStore.create({
            name: 'Order Test Product',
            price: 19.99,
            category: 'test'
        });
        testProductId = product.id as number;
    });

    it('should have an index method', () => {
        expect(orderStore.index).toBeDefined();
    });

    it('should have a create method', () => {
        expect(orderStore.create).toBeDefined();
    });

    it('should have an addProduct method', () => {
        expect(orderStore.addProduct).toBeDefined();
    });

    it('create method should add an order', async () => {
        const result = await orderStore.create({
            user_id: testUserId,
            status: 'active'
        });
        createdOrderId = result.id as number;
        expect(result.status).toEqual('active');
        expect(result.user_id).toEqual(testUserId);
    });

    it('index method should return a list of orders', async () => {
        const result = await orderStore.index();
        expect(result.length).toBeGreaterThan(0);
    });

    it('addProduct method should add a product to order', async () => {
        const result = await orderStore.addProduct(2, createdOrderId, testProductId);
        expect(result.quantity).toEqual(2);
        expect(result.order_id).toEqual(createdOrderId);
        expect(result.product_id).toEqual(testProductId);
    });

    it('show method should return order with products', async () => {
        const result = await orderStore.show(createdOrderId);
        expect(result.id).toEqual(createdOrderId);
        expect(result.products.length).toBeGreaterThan(0);
    });

    it('currentOrderByUser should return active order', async () => {
        const result = await orderStore.currentOrderByUser(testUserId);
        expect(result).not.toBeNull();
        expect(result?.status).toEqual('active');
    });

    it('delete method should remove the order', async () => {
        const result = await orderStore.delete(createdOrderId);
        expect(result.id).toEqual(createdOrderId);
    });
});
