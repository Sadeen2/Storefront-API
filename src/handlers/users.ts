import express, { Request, Response } from 'express';
import { UserStore, User } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import verifyAuthToken from '../middleware/auth';

dotenv.config();

const store = new UserStore();

const index = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await store.index();
        res.json(users);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const show = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await store.show(parseInt(req.params.id, 10));
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password
        };
        const newUser = await store.create(user);
        const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string);
        res.json({ user: newUser, token });
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const authenticate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        const user = await store.authenticate(username, password);
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);
        res.json({ user: { id: user.id, username: user.username }, token });
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const userRoutes = (app: express.Application): void => {
    app.get('/users', verifyAuthToken, index);
    app.get('/users/:id', verifyAuthToken, show);
    app.post('/users', create);
    app.post('/users/authenticate', authenticate);
};

export default userRoutes;
