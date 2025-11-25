/**
 * Types centralisés pour l'application
 * Suivant le principe de Single Responsibility (SOLID)
 */

// ============================================
// Types pour les Clients
// ============================================

export interface Client {
  id?: number
  clientName: string
  contactPerson?: string
  email?: string
  phone?: string
  company?: string
  address?: string
  city?: string
  projectType?: string
  technologies?: string
  budget?: number
  startDate?: string
  endDate?: string
  status?: ClientStatus
  progress?: number
  notes?: string
  website?: string
  logo?: string
  paid?: number
  paymentStatus?: PaymentStatus
  priority?: Priority
  deadline?: string
  lastUpdate?: string
  createdAt?: string
  updatedAt?: string
}

export type ClientStatus = 'En attente' | 'En cours' | 'Terminé'
export type PaymentStatus = 'Impayé' | 'Partiel' | 'Payé'
export type Priority = 'Basse' | 'Moyenne' | 'Haute'

// ============================================
// Types pour les Abonnements
// ============================================

export interface Subscription {
  id?: number
  clientId: number
  clientName?: string
  name: string
  cost: number
  billingCycle: BillingCycle
  status: SubscriptionStatus
  startDate: string
  endDate?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export type BillingCycle = 'Mensuel' | 'Trimestriel' | 'Annuel'
export type SubscriptionStatus = 'Actif' | 'Suspendu' | 'Annulé'

// ============================================
// Types pour les Photos IA
// ============================================

export interface AiPhoto {
  id?: number
  name: string
  imagePrompt?: string
  videoPrompt?: string
  imageUrl: string
  createdAt?: string
  updatedAt?: string
}

// ============================================
// Types pour les Prompts
// ============================================

export interface Prompt {
  id?: number
  title: string
  category: string
  content: string
  createdAt?: string
  updatedAt?: string
}

// ============================================
// Types pour le Calendrier
// ============================================

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  extendedProps?: CalendarEventProps
}

export interface CalendarEventProps {
  client?: string
  type?: EventType
  description?: string
}

export type EventType = 'Réunion' | 'Livraison' | 'Deadline' | 'Review' | 'Formation'

// ============================================
// Types pour les Templates
// ============================================

export interface EmailTemplate {
  subject: string
  body: string
}

export interface EmailTemplates {
  [key: string]: EmailTemplate
}

// ============================================
// Types pour les Formulaires
// ============================================

export interface ClientFormData extends Omit<Client, 'id' | 'createdAt' | 'updatedAt'> {}

export interface SubscriptionFormData extends Omit<Subscription, 'id' | 'clientName' | 'createdAt' | 'updatedAt'> {}

export interface EventFormData {
  title: string
  start: string
  end: string
  client: string
  type: EventType
  description: string
  backgroundColor: string
}

// ============================================
// Types pour l'UI
// ============================================

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface SelectOption<T = string> {
  value: T
  label: string
}

// ============================================
// Types pour les Actions de la Grille
// ============================================

export interface GridActionContext<T> {
  onEdit?: (data: T) => void
  onDelete?: (data: T) => void
  onTemplate?: (data: T) => void
}
