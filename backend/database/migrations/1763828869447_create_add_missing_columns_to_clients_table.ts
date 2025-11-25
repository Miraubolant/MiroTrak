import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Ajouter les colonnes manquantes
      table.string('priority').defaultTo('Moyenne')
      table.date('deadline').nullable()
      table.json('attachments').nullable()
      table.json('todos').nullable()
      table.string('dev_password').nullable()
      table.string('github_repo').nullable()
      table.string('supabase_url').nullable()
      table.string('supabase_key').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('priority')
      table.dropColumn('deadline')
      table.dropColumn('attachments')
      table.dropColumn('todos')
      table.dropColumn('dev_password')
      table.dropColumn('github_repo')
      table.dropColumn('supabase_url')
      table.dropColumn('supabase_key')
    })
  }
}