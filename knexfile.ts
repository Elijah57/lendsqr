import { Knex } from "knex";
import dotenv from "dotenv"
dotenv.config()


const config: Knex.Config = {
    
    client: "postgresql",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.PROD_DB_USER || "root",
        password: process.env.PROD_DB_PWD,
        database: process.env.PROD_DB_NAME,
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