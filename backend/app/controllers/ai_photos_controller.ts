import type { HttpContext } from '@adonisjs/core/http'
import AiPhoto from '#models/ai_photo'

export default class AiPhotosController {
  /**
   * Récupérer toutes les photos IA
   */
  async index({ response }: HttpContext) {
    try {
      const aiPhotos = await AiPhoto.query().orderBy('created_at', 'desc')
      return response.ok(aiPhotos)
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la récupération des photos', error })
    }
  }

  /**
   * Récupérer une photo par son ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const aiPhoto = await AiPhoto.findOrFail(params.id)
      return response.ok(aiPhoto)
    } catch (error) {
      return response.notFound({ message: 'Photo non trouvée' })
    }
  }

  /**
   * Créer une nouvelle photo IA
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'name',
        'imagePrompt',
        'videoPrompt',
        'imageUrl'
      ])

      // S'assurer que les champs optionnels sont null plutôt qu'undefined
      const cleanData = {
        name: data.name,
        imagePrompt: data.imagePrompt || null,
        videoPrompt: data.videoPrompt || null,
        imageUrl: data.imageUrl
      }

      const aiPhoto = await AiPhoto.create(cleanData)
      return response.created(aiPhoto)
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la création de la photo' })
    }
  }

  /**
   * Mettre à jour une photo IA
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const aiPhoto = await AiPhoto.findOrFail(params.id)

      const data = request.only([
        'name',
        'imagePrompt',
        'videoPrompt',
        'imageUrl'
      ])

      // S'assurer que les champs optionnels sont null plutôt qu'undefined
      const cleanData = {
        name: data.name,
        imagePrompt: data.imagePrompt || null,
        videoPrompt: data.videoPrompt || null,
        imageUrl: data.imageUrl
      }

      aiPhoto.merge(cleanData)
      await aiPhoto.save()

      return response.ok(aiPhoto)
    } catch (error) {
      return response.notFound({ message: 'Photo non trouvée' })
    }
  }

  /**
   * Supprimer une photo IA
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const aiPhoto = await AiPhoto.findOrFail(params.id)
      await aiPhoto.delete()
      return response.ok({ message: 'Photo supprimée avec succès' })
    } catch (error) {
      return response.notFound({ message: 'Photo non trouvée' })
    }
  }

  /**
   * Supprimer plusieurs photos IA
   */
  async bulkDestroy({ request, response }: HttpContext) {
    try {
      const { ids } = request.only(['ids'])
      if (!Array.isArray(ids) || ids.length === 0) {
        return response.badRequest({ message: 'Aucun ID fourni' })
      }

      await AiPhoto.query().whereIn('id', ids).delete()
      return response.ok({ message: 'Photos supprimées avec succès' })
    } catch (error) {
      return response.internalServerError({ message: 'Erreur lors de la suppression des photos', error })
    }
  }

  /**
   * Créer plusieurs photos IA en masse
   */
  async bulkStore({ request, response }: HttpContext) {
    try {
      const { photos } = request.only(['photos'])
      
      if (!Array.isArray(photos) || photos.length === 0) {
        return response.badRequest({ message: 'Aucune photo fournie' })
      }

      const createdPhotos = []
      
      for (const photoData of photos) {
        const cleanData = {
          name: photoData.name,
          imagePrompt: photoData.imagePrompt || null,
          videoPrompt: photoData.videoPrompt || null,
          imageUrl: photoData.imageUrl
        }
        
        const aiPhoto = await AiPhoto.create(cleanData)
        createdPhotos.push(aiPhoto)
      }

      return response.created({ 
        message: `${createdPhotos.length} photo(s) créée(s) avec succès`,
        photos: createdPhotos 
      })
    } catch (error) {
      return response.badRequest({
        message: 'Erreur lors de la création en masse des photos'
      })
    }
  }
}
