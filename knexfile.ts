import { Knex } from "knex";
import dotenv from "dotenv"
dotenv.config()


const config: Knex.Config = {
    
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    },
    pool: {
        min: 5,
        max: 10
    },
    migrations: {
        directory: "./src/db/migrations",
        tableName: "knex_migrations"
    }
}

export default config