import vine from '@vinejs/vine'

/**
 * Validation du schéma pour la création d'un prompt
 */
export const createPromptValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(2).maxLength(255),
    category: vine.string().trim().minLength(2).maxLength(100),
    content: vine.string().trim().minLength(5),
  })
)

/**
 * Validation du schéma pour la mise à jour d'un prompt
 */
export const updatePromptValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(2).maxLength(255).optional(),
    category: vine.string().trim().minLength(2).maxLength(100).optional(),
    content: vine.string().trim().minLength(5).optional(),
  })
)
