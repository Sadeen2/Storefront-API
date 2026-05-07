import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
    POSTGRES_TEST_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    ENV
} = process.env;

let pool: Pool;

if (ENV === 'test') {
    pool = new Pool({
        host: POSTGRES_HOST,
        port: parseInt(POSTGRES_PORT as string, 10),
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
    });
} else {
    pool = new Pool({
        host: POSTGRES_HOST,
        port: parseInt(POSTGRES_PORT as string, 10),
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
    });
}

export default pool;
