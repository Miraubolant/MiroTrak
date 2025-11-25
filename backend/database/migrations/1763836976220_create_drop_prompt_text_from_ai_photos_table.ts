import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ai_photos'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('prompt_text')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('prompt_text').notNullable()
    })
  }
}