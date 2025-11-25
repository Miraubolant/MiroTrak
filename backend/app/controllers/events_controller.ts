import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'

export default class EventsController {
  async index({ response }: HttpContext) {
    try {
      const events = await Event.all()
      return response.json(events)
    } catch (error) {
      return response.status(500).json({ error: 'Erreur lors de la récupération des événements' })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'title',
        'start',
        'end',
        'backgroundColor',
        'borderColor',
        'client',
        'type',
        'description',
        'allDay'
      ])

      const event = await Event.create(data)
      return response.status(201).json(event)
    } catch (error) {
      return response.status(500).json({ error: 'Erreur lors de la création de l\'événement' })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const event = await Event.findOrFail(params.id)
      return response.json(event)
    } catch (error) {
      return response.status(404).json({ error: 'Événement non trouvé' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const event = await Event.findOrFail(params.id)
      const data = request.only([
        'title',
        'start',
        'end',
        'backgroundColor',
        'borderColor',
        'client',
        'type',
        'description',
        'allDay'
      ])

      event.merge(data)
      await event.save()

      return response.json(event)
    } catch (error) {
      return response.status(500).json({ error: 'Erreur lors de la mise à jour de l\'événement' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const event = await Event.findOrFail(params.id)
      await event.delete()
      return response.status(204)
    } catch (error) {
      return response.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' })
    }
  }
}
