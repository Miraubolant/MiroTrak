import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').notNullable()
      table.timestamp('start').notNullable()
      table.timestamp('end').nullable()
      table.string('background_color').defaultTo('#58a6ff')
      table.string('border_color').defaultTo('#58a6ff')
      table.string('client').nullable()
      table.string('type').nullable()
      table.text('description').nullable()
      table.boolean('all_day').defaultTo(false)
      
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
