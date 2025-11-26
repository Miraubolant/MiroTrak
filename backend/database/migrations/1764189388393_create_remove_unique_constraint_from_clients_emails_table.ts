import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Supprimer la contrainte d'unicité sur l'email
      table.dropUnique(['email'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Remettre la contrainte d'unicité sur l'email
      table.unique(['email'])
    })
  }
}
