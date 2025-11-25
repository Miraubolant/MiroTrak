import axios from 'axios'
import type { Client, Subscription, AiPhoto, Prompt } from '../types'

// En production, utilise le chemin relatif (proxé par Nginx)
// En dev local, utilise localhost:3333
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === 'production' ? '' : 'http://localhost:3333'
)

// Debug log pour vérifier l'URL API
console.log('API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  MODE: import.meta.env.MODE,
  API_URL: API_URL
})

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Interface pour les paramètres
export interface Setting {
  id?: number
  key: string
  value: string
  type?: string
  description?: string
}

// Interface pour la stack technique
export interface StackTechnique {
  frontend: string
  backend: string
  database: string
  deployment: string
  versionControl: string
  tools: string
  workflow: string
  notes: string
}

// Interface pour les templates PDF
export interface PdfTemplate {
  name: string
  content: string
  enabled: boolean
}

export interface PdfTemplates {
  [key: string]: PdfTemplate
}

// Interface pour les templates email
export interface EmailTemplate {
  subject: string
  body: string
}

export interface EmailTemplates {
  [key: string]: EmailTemplate
}

// API Clients
export const clientsAPI = {
  // Récupérer tous les clients
  getAll: async (): Promise<Client[]> => {
    const response = await api.get('/api/clients')
    return response.data
  },

  // Récupérer un client par ID
  getById: async (id: number): Promise<Client> => {
    const response = await api.get(`/api/clients/${id}`)
    return response.data
  },

  // Créer un nouveau client
  create: async (client: Omit<Client, 'id'>): Promise<Client> => {
    const response = await api.post('/api/clients', client)
    return response.data
  },

  // Mettre à jour un client
  update: async (id: number, client: Partial<Client>): Promise<Client> => {
    const response = await api.put(`/api/clients/${id}`, client)
    return response.data
  },

  // Supprimer un client
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/clients/${id}`)
  },
}

// API Settings
export const settingsAPI = {
  // Récupérer tous les paramètres
  getAll: async (): Promise<Setting[]> => {
    const response = await api.get('/api/settings')
    return response.data
  },

  // Récupérer un paramètre par clé
  getByKey: async (key: string): Promise<Setting> => {
    const response = await api.get(`/api/settings/${key}`)
    return response.data
  },

  // Sauvegarder un paramètre
  save: async (setting: Omit<Setting, 'id'>): Promise<Setting> => {
    const response = await api.post('/api/settings', setting)
    return response.data
  },

  // Sauvegarder plusieurs paramètres
  saveBulk: async (settings: Omit<Setting, 'id'>[]): Promise<Setting[]> => {
    const response = await api.post('/api/settings/bulk', { settings })
    return response.data
  },

  // Supprimer un paramètre
  delete: async (key: string): Promise<void> => {
    await api.delete(`/api/settings/${key}`)
  },
}

// API Stack Technique
export const stackTechniqueAPI = {
  // Récupérer la stack technique
  get: async (): Promise<StackTechnique | null> => {
    try {
      const response = await api.get('/api/settings/stack_technique')
      return JSON.parse(response.data.value)
    } catch (error) {
      return null
    }
  },

  // Sauvegarder la stack technique
  save: async (stack: StackTechnique): Promise<void> => {
    await api.post('/api/settings', {
      key: 'stack_technique',
      value: JSON.stringify(stack),
      type: 'json',
      description: 'Stack technique et workflow de développement'
    })
  },
}

// API Templates
export const templatesAPI = {
  // Récupérer tous les templates PDF
  getAll: async (): Promise<PdfTemplates> => {
    const response = await api.get('/api/templates')
    return response.data
  },

  // Récupérer un template par type
  getByType: async (type: string): Promise<PdfTemplate> => {
    const response = await api.get(`/api/templates/${type}`)
    return response.data
  },

  // Sauvegarder un template
  save: async (type: string, template: PdfTemplate): Promise<void> => {
    await api.post('/api/templates', {
      type,
      ...template
    })
  },

  // Sauvegarder plusieurs templates
  saveBulk: async (templates: PdfTemplates): Promise<void> => {
    await api.post('/api/templates/bulk', { templates })
  },
}

// API Email Templates
export const emailTemplatesAPI = {
  // Récupérer tous les templates email
  getAll: async (): Promise<EmailTemplates> => {
    try {
      const response = await api.get('/api/settings/email_templates')
      return JSON.parse(response.data.value)
    } catch (error) {
      return {}
    }
  },

  // Sauvegarder les templates email
  save: async (templates: EmailTemplates): Promise<void> => {
    await api.post('/api/settings', {
      key: 'email_templates',
      value: JSON.stringify(templates),
      type: 'json',
      description: 'Templates d\'emails par type de document'
    })
  },
}

// API Subscriptions
export const subscriptionsAPI = {
  // Récupérer tous les abonnements
  getAll: async (): Promise<Subscription[]> => {
    const response = await api.get('/api/subscriptions')
    return response.data
  },

  // Récupérer un abonnement par ID
  getById: async (id: number): Promise<Subscription> => {
    const response = await api.get(`/api/subscriptions/${id}`)
    return response.data
  },

  // Récupérer les abonnements par client
  getByClientId: async (clientId: number): Promise<Subscription[]> => {
    const response = await api.get(`/api/subscriptions/client/${clientId}`)
    return response.data
  },

  // Créer un nouvel abonnement
  create: async (subscription: Omit<Subscription, 'id'>): Promise<Subscription> => {
    const response = await api.post('/api/subscriptions', subscription)
    return response.data
  },

  // Mettre à jour un abonnement
  update: async (id: number, subscription: Partial<Subscription>): Promise<Subscription> => {
    const response = await api.put(`/api/subscriptions/${id}`, subscription)
    return response.data
  },

  // Supprimer un abonnement
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/subscriptions/${id}`)
  },
}

// API Photos IA
export const aiPhotosAPI = {
  // Récupérer toutes les photos IA
  getAll: async (): Promise<AiPhoto[]> => {
    const response = await api.get('/api/ai-photos')
    return response.data
  },

  // Récupérer une photo par ID
  getById: async (id: number): Promise<AiPhoto> => {
    const response = await api.get(`/api/ai-photos/${id}`)
    return response.data
  },

  // Créer une nouvelle photo IA
  create: async (photo: Omit<AiPhoto, 'id' | 'createdAt' | 'updatedAt'>): Promise<AiPhoto> => {
    const response = await api.post('/api/ai-photos', photo)
    return response.data
  },

  // Créer plusieurs photos IA en masse
  createBulk: async (photos: Omit<AiPhoto, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<{ message: string, photos: AiPhoto[] }> => {
    const response = await api.post('/api/ai-photos/bulk-store', { photos })
    return response.data
  },

  // Mettre à jour une photo IA
  update: async (id: number, photo: Partial<AiPhoto>): Promise<AiPhoto> => {
    const response = await api.put(`/api/ai-photos/${id}`, photo)
    return response.data
  },

  // Supprimer plusieurs photos IA
  deleteBulk: async (ids: number[]): Promise<void> => {
    await api.post('/api/ai-photos/bulk-delete', { ids })
  },

  // Supprimer une photo IA
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/ai-photos/${id}`)
  },
}

// API Prompts
export const promptsAPI = {
  // Récupérer tous les prompts
  getAll: async (search?: string, category?: string): Promise<Prompt[]> => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (category) params.append('category', category)
    
    const response = await api.get(`/api/prompts?${params.toString()}`)
    return response.data
  },

  // Récupérer toutes les catégories
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/api/prompts/categories')
    return response.data
  },

  // Récupérer un prompt par ID
  getById: async (id: number): Promise<Prompt> => {
    const response = await api.get(`/api/prompts/${id}`)
    return response.data
  },

  // Créer un nouveau prompt
  create: async (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prompt> => {
    const response = await api.post('/api/prompts', prompt)
    return response.data
  },

  // Mettre à jour un prompt
  update: async (id: number, prompt: Partial<Prompt>): Promise<Prompt> => {
    const response = await api.put(`/api/prompts/${id}`, prompt)
    return response.data
  },

  // Supprimer un prompt
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/prompts/${id}`)
  },
}

// API pour les événements du calendrier
export interface CalendarEvent {
  id?: number
  title: string
  start: string
  end?: string | null
  backgroundColor?: string
  borderColor?: string
  client?: string | null
  type?: string | null
  description?: string | null
  allDay?: boolean
  createdAt?: string
  updatedAt?: string
}

export const eventsAPI = {
  // Récupérer tous les événements
  getAll: async (): Promise<CalendarEvent[]> => {
    const response = await api.get('/api/events')
    return response.data
  },

  // Récupérer un événement par ID
  getById: async (id: number): Promise<CalendarEvent> => {
    const response = await api.get(`/api/events/${id}`)
    return response.data
  },

  // Créer un nouvel événement
  create: async (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> => {
    const response = await api.post('/api/events', event)
    return response.data
  },

  // Mettre à jour un événement
  update: async (id: number, event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    const response = await api.put(`/api/events/${id}`, event)
    return response.data
  },

  // Supprimer un événement
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/events/${id}`)
  },
}

export default api
