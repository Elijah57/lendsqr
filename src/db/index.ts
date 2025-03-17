import Knex from "knex";
import config from "../../knexfile";

const db = Knex(config)
export default db