import pool from '../database';

export type Product = {
    id?: number;
    name: string;
    price: number;
    category?: string;
};

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM products WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err}`);
        }
    }

    async create(p: Product): Promise<Product> {
        try {
            const conn = await pool.connect();
            const sql =
                'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [p.name, p.price, p.category || null]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add product ${p.name}. Error: ${err}`);
        }
    }

    async update(id: number, p: Partial<Product>): Promise<Product> {
        try {
            const conn = await pool.connect();
            const sql =
                'UPDATE products SET name=($1), price=($2), category=($3) WHERE id=($4) RETURNING *';
            const existing = await this.show(id);
            const result = await conn.query(sql, [
                p.name ?? existing.name,
                p.price ?? existing.price,
                p.category ?? existing.category,
                id
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update product ${id}. Error: ${err}`);
        }
    }

    async delete(id: number): Promise<Product> {
        try {
            const conn = await pool.connect();
            const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete product ${id}. Error: ${err}`);
        }
    }

    async productsByCategory(category: string): Promise<Product[]> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM products WHERE category=($1)';
            const result = await conn.query(sql, [category]);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products by category ${category}. Error: ${err}`);
        }
    }

    async topFiveProducts(): Promise<Product[]> {
        try {
            const conn = await pool.connect();
            const sql = `
                SELECT p.id, p.name, p.price, p.category, SUM(op.quantity) AS total_ordered
                FROM products p
                JOIN order_products op ON p.id = op.product_id
                GROUP BY p.id
                ORDER BY total_ordered DESC
                LIMIT 5
            `;
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get top products. Error: ${err}`);
        }
    }
}
