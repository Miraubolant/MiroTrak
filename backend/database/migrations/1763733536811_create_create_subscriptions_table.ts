import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('client_id').unsigned().notNullable().references('id').inTable('clients').onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.decimal('cost', 12, 2).notNullable()
      table.string('billing_cycle', 50).notNullable()
      table.string('status', 50).notNullable().defaultTo('Actif')
      table.date('start_date').notNullable()
      table.date('end_date').nullable()
      table.text('notes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}