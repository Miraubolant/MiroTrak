import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientName: string

  @column()
  declare contactPerson: string | null

  @column()
  declare email: string | null

  @column()
  declare phone: string | null

  @column()
  declare company: string | null

  @column()
  declare address: string | null

  @column()
  declare city: string | null

  @column()
  declare postalCode: string | null

  @column()
  declare country: string

  @column()
  declare projectType: string | null

  @column()
  declare technologies: string | null

  @column()
  declare budget: number | null

  @column.date()
  declare startDate: DateTime | null

  @column.date()
  declare endDate: DateTime | null

  @column()
  declare status: string

  @column()
  declare progress: number

  @column()
  declare notes: string | null

  @column()
  declare website: string | null

  @column()
  declare logo: string | null

  @column()
  declare priority: string

  @column.date()
  declare deadline: DateTime | null

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => {
      if (!value || value === '') return []
      try {
        return JSON.parse(value)
      } catch {
        return []
      }
    },
  })
  declare attachments: any[]

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => {
      if (!value || value === '') return []
      try {
        return JSON.parse(value)
      } catch {
        return []
      }
    },
  })
  declare todos: any[]

  @column()
  declare devPassword: string | null

  @column()
  declare githubRepo: string | null

  @column()
  declare supabaseUrl: string | null

  @column()
  declare supabaseKey: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}