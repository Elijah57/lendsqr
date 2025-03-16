import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", (table)=>{
        table.uuid("id").primary().defaultTo(knex.fn.uuid())
        table.string("firstname").notNullable()
        table.string("lastname").notNullable()
        table.string("phoneno").notNullable()
        table.string("email").notNullable().unique()
        table.string("passwordhash").notNullable()
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users')
}

