import pool from '../database';

export type Order = {
    id?: number;
    user_id: number;
    status: 'active' | 'complete';
};

export type OrderProduct = {
    id?: number;
    order_id: number;
    product_id: number;
    quantity: number;
};

export type OrderWithProducts = Order & {
    products: Array<{
        product_id: number;
        name: string;
        price: number;
        quantity: number;
    }>;
};

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`);
        }
    }

    async show(id: number): Promise<OrderWithProducts> {
        try {
            const conn = await pool.connect();
            const orderSql = 'SELECT * FROM orders WHERE id=($1)';
            const orderResult = await conn.query(orderSql, [id]);

            const productsSql = `
                SELECT op.product_id, p.name, p.price, op.quantity
                FROM order_products op
                JOIN products p ON op.product_id = p.id
                WHERE op.order_id=($1)
            `;
            const productsResult = await conn.query(productsSql, [id]);
            conn.release();

            return {
                ...orderResult.rows[0],
                products: productsResult.rows
            };
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`);
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const conn = await pool.connect();
            const sql =
                'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
            const result = await conn.query(sql, [o.user_id, o.status]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create order. Error: ${err}`);
        }
    }

    async addProduct(
        quantity: number,
        orderId: number,
        productId: number
    ): Promise<OrderProduct> {
        try {
            const conn = await pool.connect();
            const checkSql = 'SELECT status FROM orders WHERE id=($1)';
            const checkResult = await conn.query(checkSql, [orderId]);

            if (checkResult.rows[0].status !== 'active') {
                throw new Error(
                    `Could not add product ${productId} to order ${orderId} because order status is ${checkResult.rows[0].status}`
                );
            }

            const sql =
                'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [orderId, productId, quantity]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(
                `Could not add product ${productId} to order ${orderId}. Error: ${err}`
            );
        }
    }

    async currentOrderByUser(userId: number): Promise<OrderWithProducts | null> {
        try {
            const conn = await pool.connect();
            const sql = `
                SELECT o.*, 
                       json_agg(json_build_object(
                           'product_id', op.product_id,
                           'name', p.name,
                           'price', p.price,
                           'quantity', op.quantity
                       )) AS products
                FROM orders o
                LEFT JOIN order_products op ON o.id = op.order_id
                LEFT JOIN products p ON op.product_id = p.id
                WHERE o.user_id=($1) AND o.status='active'
                GROUP BY o.id
                ORDER BY o.id DESC
                LIMIT 1
            `;
            const result = await conn.query(sql, [userId]);
            conn.release();
            return result.rows[0] || null;
        } catch (err) {
            throw new Error(
                `Could not get current order for user ${userId}. Error: ${err}`
            );
        }
    }

    async completedOrdersByUser(userId: number): Promise<OrderWithProducts[]> {
        try {
            const conn = await pool.connect();
            const sql = `
                SELECT o.*,
                       json_agg(json_build_object(
                           'product_id', op.product_id,
                           'name', p.name,
                           'price', p.price,
                           'quantity', op.quantity
                       )) AS products
                FROM orders o
                LEFT JOIN order_products op ON o.id = op.order_id
                LEFT JOIN products p ON op.product_id = p.id
                WHERE o.user_id=($1) AND o.status='complete'
                GROUP BY o.id
                ORDER BY o.id DESC
            `;
            const result = await conn.query(sql, [userId]);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(
                `Could not get completed orders for user ${userId}. Error: ${err}`
            );
        }
    }

    async delete(id: number): Promise<Order> {
        try {
            const conn = await pool.connect();
            // Remove products first
            await conn.query('DELETE FROM order_products WHERE order_id=($1)', [id]);
            const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete order ${id}. Error: ${err}`);
        }
    }
}
