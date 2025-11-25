import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ai_photos'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('image_prompt').nullable()
      table.text('video_prompt').nullable()
    })
    
    // Copier prompt_text vers image_prompt pour les enregistrements existants
    this.defer(async (db) => {
      await db.rawQuery('UPDATE ai_photos SET image_prompt = prompt_text WHERE image_prompt IS NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('image_prompt')
      table.dropColumn('video_prompt')
    })
  }
}