import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("wallets", (table)=>{
        table.uuid("id").primary().defaultTo(knex.fn.uuid())
        table.uuid("user_id").notNullable().references("id").inTable("users").unique().onDelete("")
        table.string("account_name").notNullable()
        table.string("account_number").notNullable().unique()
        table.decimal("account_balance", 15, 2).notNullable().defaultTo(0)
        table.string("currency").notNullable().defaultTo("NGN")
        table.string("provider").notNullable().defaultTo("lendsqr-demo")
        table.string("type").notNullable().defaultTo("default")  
        table.timestamp("balance_last_updated")
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("wallets")
}

