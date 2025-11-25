import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('client_name', 255).notNullable()
      table.string('contact_person', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('phone', 50)
      table.string('company', 255)
      table.text('address')
      table.string('city', 100)
      table.string('postal_code', 20)
      table.string('country', 100).defaultTo('France')
      table.string('project_type', 100)
      table.text('technologies')
      table.decimal('budget', 12, 2)
      table.date('start_date')
      table.date('end_date')
      table.string('status', 50).defaultTo('En cours')
      table.integer('progress').defaultTo(0)
      table.text('notes')
      table.string('website', 255)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}