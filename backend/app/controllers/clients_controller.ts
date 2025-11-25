import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'

export default class ClientsController {
  /**
   * Récupérer tous les clients
   */
  async index({ response }: HttpContext) {
    try {
      console.log('ClientsController.index - Début')
      const clients = await Client.all()
      console.log('ClientsController.index - Clients récupérés:', clients.length)
      return response.ok(clients)
    } catch (error) {
      console.error('ClientsController.index - Erreur:', error)
      return response.internalServerError({ message: 'Erreur lors de la récupération des clients', error: error.message })
    }
  }

  /**
   * Récupérer un client par son ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const client = await Client.findOrFail(params.id)
      return response.ok(client)
    } catch (error) {
      return response.notFound({ message: 'Client non trouvé' })
    }
  }

  /**
   * Créer un nouveau client
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'clientName',
        'contactPerson',
        'email',
        'phone',
        'company',
        'address',
        'city',
        'postalCode',
        'country',
        'projectType',
        'technologies',
        'budget',
        'startDate',
        'endDate',
        'status',
        'progress',
        'notes',
        'website',
        'logo'
      ])

      const client = await Client.create(data)
      return response.created(client)
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la création du client', error })
    }
  }

  /**
   * Mettre à jour un client
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const client = await Client.findOrFail(params.id)

      const data = request.only([
        'clientName',
        'contactPerson',
        'email',
        'phone',
        'company',
        'address',
        'city',
        'postalCode',
        'country',
        'projectType',
        'technologies',
        'budget',
        'startDate',
        'endDate',
        'status',
        'progress',
        'notes',
        'website',
        'logo'
      ])

      client.merge(data)
      await client.save()

      return response.ok(client)
    } catch (error) {
      return response.notFound({ message: 'Client non trouvé' })
    }
  }

  /**
   * Supprimer un client
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const client = await Client.findOrFail(params.id)
      await client.delete()
      return response.ok({ message: 'Client supprimé avec succès' })
    } catch (error) {
      return response.notFound({ message: 'Client non trouvé' })
    }
  }
}