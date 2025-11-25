import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Supprimer les champs sensibles inutilisés
      table.dropColumn('dev_password')
      table.dropColumn('github_repo')
      table.dropColumn('supabase_url')
      table.dropColumn('supabase_key')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Restaurer les colonnes en cas de rollback
      table.string('dev_password', 255).nullable()
      table.string('github_repo', 255).nullable()
      table.string('supabase_url', 255).nullable()
      table.string('supabase_key', 255).nullable()
    })
  }
}