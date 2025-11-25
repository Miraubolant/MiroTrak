import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column.dateTime()
  declare start: DateTime

  @column.dateTime()
  declare end: DateTime | null

  @column()
  declare backgroundColor: string

  @column()
  declare borderColor: string

  @column()
  declare client: string | null

  @column()
  declare type: string | null

  @column()
  declare description: string | null

  @column()
  declare allDay: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
