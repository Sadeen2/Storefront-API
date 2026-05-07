import pool from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
    id?: number;
    username: string;
    firstname: string;
    lastname: string;
    password: string;
};

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT id, username, firstname, lastname FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }

    async show(id: number): Promise<User> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT id, username, firstname, lastname FROM users WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`);
        }
    }

    async create(u: User): Promise<User> {
        try {
            const conn = await pool.connect();
            const sql =
                'INSERT INTO users (username, firstname, lastname, password_digest) VALUES($1, $2, $3, $4) RETURNING id, username, firstname, lastname';
            const hash = bcrypt.hashSync(
                u.password + BCRYPT_PASSWORD,
                parseInt(SALT_ROUNDS as string, 10)
            );
            const result = await conn.query(sql, [u.username, u.firstname, u.lastname, hash]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add user ${u.username}. Error: ${err}`);
        }
    }

    async authenticate(username: string, password: string): Promise<User | null> {
        try {
            const conn = await pool.connect();
            const sql = 'SELECT * FROM users WHERE username=($1)';
            const result = await conn.query(sql, [username]);
            conn.release();

            if (result.rows.length > 0) {
                const user = result.rows[0];
                if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password_digest)) {
                    return user;
                }
            }
            return null;
        } catch (err) {
            throw new Error(`Could not authenticate user ${username}. Error: ${err}`);
        }
    }
}
