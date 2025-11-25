import type { HttpContext } from '@adonisjs/core/http'
import Subscription from '#models/subscription'
import Client from '#models/client'

export default class SubscriptionsController {
  /**
   * Récupérer tous les abonnements
   */
  async index({ response }: HttpContext) {
    try {
      const subscriptions = await Subscription.query().preload('client')

      // Transformer les données pour inclure le nom du client
      const subscriptionsWithClientName = subscriptions.map(sub => ({
        ...sub.toJSON(),
        clientName: sub.client.clientName
      }))

      return response.ok(subscriptionsWithClientName)
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la récupération des abonnements' })
    }
  }

  /**
   * Récupérer un abonnement par son ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const subscription = await Subscription.query()
        .where('id', params.id)
        .preload('client')
        .firstOrFail()

      return response.ok({
        ...subscription.toJSON(),
        clientName: subscription.client.clientName
      })
    } catch (error) {
      return response.notFound({ message: 'Abonnement non trouvé' })
    }
  }

  /**
   * Récupérer les abonnements d'un client
   */
  async getByClient({ params, response }: HttpContext) {
    try {
      const subscriptions = await Subscription.query()
        .where('client_id', params.clientId)
        .preload('client')

      const subscriptionsWithClientName = subscriptions.map(sub => ({
        ...sub.toJSON(),
        clientName: sub.client.clientName
      }))

      return response.ok(subscriptionsWithClientName)
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la récupération des abonnements' })
    }
  }

  /**
   * Créer un nouvel abonnement
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'clientId',
        'name',
        'cost',
        'billingCycle',
        'status',
        'startDate',
        'endDate',
        'notes'
      ])

      // Vérifier que le client existe
      const client = await Client.findOrFail(data.clientId)

      const subscription = await Subscription.create(data)
      await subscription.load('client')

      return response.created({
        ...subscription.toJSON(),
        clientName: client.clientName
      })
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la création de l\'abonnement' })
    }
  }

  /**
   * Mettre à jour un abonnement
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const subscription = await Subscription.findOrFail(params.id)

      const data = request.only([
        'clientId',
        'name',
        'cost',
        'billingCycle',
        'status',
        'startDate',
        'endDate',
        'notes'
      ])

      subscription.merge(data)
      await subscription.save()
      await subscription.load('client')

      return response.ok({
        ...subscription.toJSON(),
        clientName: subscription.client.clientName
      })
    } catch (error) {
      return response.notFound({ message: 'Abonnement non trouvé' })
    }
  }

  /**
   * Supprimer un abonnement
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const subscription = await Subscription.findOrFail(params.id)
      await subscription.delete()
      return response.ok({ message: 'Abonnement supprimé avec succès' })
    } catch (error) {
      return response.notFound({ message: 'Abonnement non trouvé' })
    }
  }
}