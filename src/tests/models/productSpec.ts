import { ProductStore } from '../../models/product';

const store = new ProductStore();

describe('Product Model', () => {
    let createdProductId: number;

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });

    it('create method should add a product', async () => {
        const result = await store.create({
            name: 'Test Widget',
            price: 9.99,
            category: 'widgets'
        });
        createdProductId = result.id as number;
        expect(result.name).toEqual('Test Widget');
        expect(parseFloat(result.price as unknown as string)).toEqual(9.99);
        expect(result.category).toEqual('widgets');
    });

    it('index method should return a list of products', async () => {
        const result = await store.index();
        expect(result.length).toBeGreaterThan(0);
    });

    it('show method should return the correct product', async () => {
        const result = await store.show(createdProductId);
        expect(result.id).toEqual(createdProductId);
        expect(result.name).toEqual('Test Widget');
    });

    it('productsByCategory should return products in category', async () => {
        const result = await store.productsByCategory('widgets');
        expect(result.length).toBeGreaterThan(0);
    });

    it('delete method should remove the product', async () => {
        await store.delete(createdProductId);
        const result = await store.show(createdProductId);
        expect(result).toBeUndefined();
    });
});
