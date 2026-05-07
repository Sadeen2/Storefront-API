import express, { Request, Response } from 'express';
import { ProductStore, Product } from '../models/product';
import verifyAuthToken from '../middleware/auth';

const store = new ProductStore();

const index = async (_req: Request, res: Response): Promise<void> => {
    try {
        const products = await store.index();
        res.json(products);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const show = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await store.show(parseInt(req.params.id, 10));
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const product: Product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        };
        const newProduct = await store.create(product);
        res.json(newProduct);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedProduct = await store.update(parseInt(req.params.id, 10), req.body);
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
    try {
        const deleted = await store.delete(parseInt(req.params.id, 10));
        res.json(deleted);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const productsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await store.productsByCategory(req.params.category);
        res.json(products);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const topFiveProducts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const products = await store.topFiveProducts();
        res.json(products);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const productRoutes = (app: express.Application): void => {
    app.get('/products', index);
    app.get('/products/top', topFiveProducts);
    app.get('/products/:id', show);
    app.post('/products', verifyAuthToken, create);
    app.put('/products/:id', verifyAuthToken, update);
    app.delete('/products/:id', verifyAuthToken, destroy);
    app.get('/products/category/:category', productsByCategory);
};

export default productRoutes;
