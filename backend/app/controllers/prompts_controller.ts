import type { HttpContext } from '@adonisjs/core/http'
import Prompt from '#models/prompt'
import { createPromptValidator, updatePromptValidator } from '#validators/create_prompt'

export default class PromptsController {
  /**
   * Récupérer tous les prompts
   */
  async index({ request, response }: HttpContext) {
    try {
      const { search, category } = request.qs()
      
      let query = Prompt.query().orderBy('created_at', 'desc')
      
      // Recherche par titre ou contenu
      if (search) {
        query = query.where((builder) => {
          builder.whereILike('title', `%${search}%`)
            .orWhereILike('content', `%${search}%`)
        })
      }
      
      // Filtrage par catégorie
      if (category) {
        query = query.where('category', category)
      }
      
      const prompts = await query
      return response.ok(prompts)
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la récupération des prompts' })
    }
  }

  /**
   * Récupérer un prompt par son ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const prompt = await Prompt.findOrFail(params.id)
      return response.ok(prompt)
    } catch (error) {
      return response.notFound({ message: 'Prompt non trouvé' })
    }
  }

  /**
   * Créer un nouveau prompt
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createPromptValidator)
      const prompt = await Prompt.create(data)
      return response.created(prompt)
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la création du prompt' })
    }
  }

  /**
   * Mettre à jour un prompt
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const prompt = await Prompt.findOrFail(params.id)
      const data = await request.validateUsing(updatePromptValidator)
      
      prompt.merge(data)
      await prompt.save()

      return response.ok(prompt)
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la mise à jour du prompt' })
    }
  }

  /**
   * Supprimer un prompt
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const prompt = await Prompt.findOrFail(params.id)
      await prompt.delete()
      return response.ok({ message: 'Prompt supprimé avec succès' })
    } catch (error) {
      return response.notFound({ message: 'Prompt non trouvé' })
    }
  }

  /**
   * Récupérer toutes les catégories uniques
   */
  async categories({ response }: HttpContext) {
    try {
      const categories = await Prompt.query()
        .distinct('category')
        .select('category')
        .orderBy('category', 'asc')

      return response.ok(categories.map(c => c.category))
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la récupération des catégories' })
    }
  }
}
