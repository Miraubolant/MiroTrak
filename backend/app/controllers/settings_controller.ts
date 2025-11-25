import type { HttpContext } from '@adonisjs/core/http'
import Setting from '#models/setting'

export default class SettingsController {
  /**
   * Récupérer tous les paramètres
   */
  async index({ response }: HttpContext) {
    try {
      const settings = await Setting.all()
      return response.ok(settings)
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la récupération des paramètres', error })
    }
  }

  /**
   * Récupérer un paramètre par sa clé
   */
  async show({ params, response }: HttpContext) {
    try {
      const setting = await Setting.findByOrFail('key', params.key)
      return response.ok(setting)
    } catch (error) {
      return response.notFound({ message: 'Paramètre non trouvé' })
    }
  }

  /**
   * Créer ou mettre à jour un paramètre
   */
  async store({ request, response }: HttpContext) {
    try {
      const { key, value, type, description } = request.only(['key', 'value', 'type', 'description'])

      const setting = await Setting.updateOrCreate(
        { key },
        { value, type: type || 'string', description }
      )

      return response.ok(setting)
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la sauvegarde du paramètre', error })
    }
  }

  /**
   * Mettre à jour plusieurs paramètres
   */
  async bulkUpdate({ request, response }: HttpContext) {
    try {
      const settings = request.input('settings', [])

      for (const settingData of settings) {
        await Setting.updateOrCreate(
          { key: settingData.key },
          { 
            value: settingData.value,
            type: settingData.type || 'string',
            description: settingData.description
          }
        )
      }

      const updatedSettings = await Setting.all()
      return response.ok(updatedSettings)
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la mise à jour des paramètres', error })
    }
  }

  /**
   * Supprimer un paramètre
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const setting = await Setting.findByOrFail('key', params.key)
      await setting.delete()
      return response.ok({ message: 'Paramètre supprimé avec succès' })
    } catch (error) {
      return response.notFound({ message: 'Paramètre non trouvé' })
    }
  }
}