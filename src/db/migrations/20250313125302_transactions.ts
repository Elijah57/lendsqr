import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("transactions", (table)=>{
        table.uuid("id").primary().defaultTo(knex.fn.uuid())
        table.json("sender").nullable()
        table.json("receiver").nullable()
        table.decimal("amount", 18, 2).notNullable()
        table.enum("type", ["transfer", "deposit", "withdrawal"]).notNullable()
        table.string("reference").unique().notNullable()
        table.string("description").nullable()
        table.timestamp("created_at").defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("transactions")
}

