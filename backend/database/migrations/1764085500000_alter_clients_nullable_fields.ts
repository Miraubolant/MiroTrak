import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('contact_person', 255).nullable().alter()
      table.string('email', 255).nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('contact_person', 255).notNullable().alter()
      table.string('email', 255).notNullable().alter()
    })
  }
}
