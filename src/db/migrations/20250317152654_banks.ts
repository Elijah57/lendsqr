import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("banks", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("code").notNullable().unique();
        table.string("slug").notNullable().unique();
        table.string("longcode").nullable();
        table.string("country").notNullable().defaultTo("Nigeria");
        table.string("currency").notNullable().defaultTo("NGN");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("banks");
}
