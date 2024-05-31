import { registerAs } from '@nestjs/config';
import 'dotenv/config';
import { Surreal } from 'surrealdb.js';
export default registerAs('database', () => ({
  postgres: {
    type: process.env.DATABASE_USER,
    enableSSL: process.env.ENABLE_SQL_SSL,
    host: process.env.INSTANCE_CONNECTION_NAME,
    port: process.env.DATABASE_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    synchronize: process.env.DATABASE_SYNCHRONIZE,
  },
}));
