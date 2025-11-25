import vine from '@vinejs/vine'

/**
 * Validation du schéma pour la création d'un client
 */
export const createClientValidator = vine.compile(
  vine.object({
    clientName: vine.string().trim().minLength(2).maxLength(255),
    contactPerson: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email().maxLength(255),
    phone: vine.string().trim().maxLength(50).optional(),
    company: vine.string().trim().maxLength(255).optional(),
    address: vine.string().trim().optional(),
    city: vine.string().trim().maxLength(100).optional(),
    postalCode: vine.string().trim().maxLength(20).optional(),
    country: vine.string().trim().maxLength(100).optional(),
    projectType: vine.string().trim().maxLength(100).optional(),
    technologies: vine.string().trim().optional(),
    budget: vine.number().positive().optional(),
    startDate: vine.date({ formats: ['YYYY-MM-DD', 'YYYY/MM/DD'] }).optional(),
    endDate: vine.date({ formats: ['YYYY-MM-DD', 'YYYY/MM/DD'] }).optional(),
    status: vine.string().trim().maxLength(50).optional(),
    progress: vine.number().min(0).max(100).optional(),
    notes: vine.string().trim().optional(),
    website: vine.string().trim().maxLength(255).optional(),
  })
)

/**
 * Validation du schéma pour la mise à jour d'un client
 */
export const updateClientValidator = vine.compile(
  vine.object({
    clientName: vine.string().trim().minLength(2).maxLength(255).optional(),
    contactPerson: vine.string().trim().minLength(2).maxLength(255).optional(),
    email: vine.string().trim().email().maxLength(255).optional(),
    phone: vine.string().trim().maxLength(50).optional(),
    company: vine.string().trim().maxLength(255).optional(),
    address: vine.string().trim().optional(),
    city: vine.string().trim().maxLength(100).optional(),
    postalCode: vine.string().trim().maxLength(20).optional(),
    country: vine.string().trim().maxLength(100).optional(),
    projectType: vine.string().trim().maxLength(100).optional(),
    technologies: vine.string().trim().optional(),
    budget: vine.number().positive().optional(),
    startDate: vine.date({ formats: ['YYYY-MM-DD', 'YYYY/MM/DD'] }).optional(),
    endDate: vine.date({ formats: ['YYYY-MM-DD', 'YYYY/MM/DD'] }).optional(),
    status: vine.string().trim().maxLength(50).optional(),
    progress: vine.number().min(0).max(100).optional(),
    notes: vine.string().trim().optional(),
    website: vine.string().trim().maxLength(255).optional(),
  })
)