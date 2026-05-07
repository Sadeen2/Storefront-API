import express, { Request, Response } from 'express';
import { OrderStore, Order } from '../models/order';
import verifyAuthToken from '../middleware/auth';

const store = new OrderStore();

const index = async (_req: Request, res: Response): Promise<void> => {
    try {
        const orders = await store.index();
        res.json(orders);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const show = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await store.show(parseInt(req.params.id, 10));
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const order: Order = {
            user_id: req.body.user_id,
            status: req.body.status || 'active'
        };
        const newOrder = await store.create(order);
        res.json(newOrder);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = parseInt(req.params.id, 10);
        const productId = parseInt(req.body.product_id, 10);
        const quantity = parseInt(req.body.quantity, 10);
        const orderProduct = await store.addProduct(quantity, orderId, productId);
        res.json(orderProduct);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const currentOrderByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await store.currentOrderByUser(parseInt(req.params.id, 10));
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const completedOrdersByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await store.completedOrdersByUser(parseInt(req.params.id, 10));
        res.json(orders);
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

const orderRoutes = (app: express.Application): void => {
    app.get('/orders', verifyAuthToken, index);
    app.get('/orders/:id', verifyAuthToken, show);
    app.post('/orders', verifyAuthToken, create);
    app.post('/orders/:id/products', verifyAuthToken, addProduct);
    app.get('/orders/user/:id/current', verifyAuthToken, currentOrderByUser);
    app.get('/orders/user/:id/completed', verifyAuthToken, completedOrdersByUser);
    app.delete('/orders/:id', verifyAuthToken, destroy);
};

export default orderRoutes;
