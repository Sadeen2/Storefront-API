import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Register routes
userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.get('/', (_req, res) => {
    res.json({ message: 'Storefront API is running' });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

export default app;
