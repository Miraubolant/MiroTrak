import type { HttpContext } from '@adonisjs/core/http'
import Setting from '#models/setting'

export default class TemplatesController {
  /**
   * Récupérer tous les templates PDF
   */
  async index({ response }: HttpContext) {
    try {
      const templatesSetting = await Setting.findByOrFail('key', 'pdf_templates')
      const templates = JSON.parse(templatesSetting.value)
      return response.ok(templates)
    } catch (error) {
      return response.notFound({ message: 'Templates non trouvés' })
    }
  }

  /**
   * Récupérer un template par son type
   */
  async show({ params, response }: HttpContext) {
    try {
      const templatesSetting = await Setting.findByOrFail('key', 'pdf_templates')
      const templates = JSON.parse(templatesSetting.value)

      if (!templates[params.type]) {
        return response.notFound({ message: 'Template non trouvé' })
      }

      return response.ok(templates[params.type])
    } catch (error) {
      return response.notFound({ message: 'Template non trouvé' })
    }
  }

  /**
   * Créer ou mettre à jour un template
   */
  async store({ request, response }: HttpContext) {
    try {
      const { type, name, content, enabled } = request.only(['type', 'name', 'content', 'enabled'])

      // Récupérer les templates existants
      let templates: Record<string, any> = {}
      try {
        const templatesSetting = await Setting.findByOrFail('key', 'pdf_templates')
        templates = JSON.parse(templatesSetting.value)
      } catch (error) {
        // Si les templates n'existent pas encore, on les crée
      }

      // Mettre à jour le template
      templates[type] = {
        name,
        content,
        enabled: enabled !== undefined ? enabled : true
      }

      // Sauvegarder dans la base de données
      await Setting.updateOrCreate(
        { key: 'pdf_templates' },
        {
          value: JSON.stringify(templates),
          type: 'json',
          description: 'Templates PDF personnalisables'
        }
      )

      return response.ok({ message: 'Template sauvegardé avec succès', templates })
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la sauvegarde du template', error })
    }
  }

  /**
   * Mettre à jour plusieurs templates
   */
  async bulkUpdate({ request, response }: HttpContext) {
    try {
      const { templates } = request.only(['templates'])

      await Setting.updateOrCreate(
        { key: 'pdf_templates' },
        {
          value: JSON.stringify(templates),
          type: 'json',
          description: 'Templates PDF personnalisables'
        }
      )

      return response.ok({ message: 'Templates sauvegardés avec succès', templates })
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la sauvegarde des templates', error })
    }
  }
}
