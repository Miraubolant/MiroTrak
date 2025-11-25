/**
 * Constantes de l'application
 * Centralise toutes les valeurs magiques pour une meilleure maintenabilité
 */

// ============================================
// Options de formulaires
// ============================================

export const CLIENT_STATUS_OPTIONS = [
  { value: 'En attente', label: 'En attente' },
  { value: 'En cours', label: 'En cours' },
  { value: 'Terminé', label: 'Terminé' },
] as const

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'Impayé', label: 'Impayé' },
  { value: 'Partiel', label: 'Partiel' },
  { value: 'Payé', label: 'Payé' },
] as const

export const PRIORITY_OPTIONS = [
  { value: 'Basse', label: 'Basse' },
  { value: 'Moyenne', label: 'Moyenne' },
  { value: 'Haute', label: 'Haute' },
] as const

export const BILLING_CYCLE_OPTIONS = [
  { value: 'Mensuel', label: 'Mensuel' },
  { value: 'Trimestriel', label: 'Trimestriel' },
  { value: 'Annuel', label: 'Annuel' },
] as const

export const SUBSCRIPTION_STATUS_OPTIONS = [
  { value: 'Actif', label: 'Actif' },
  { value: 'Suspendu', label: 'Suspendu' },
  { value: 'Annulé', label: 'Annulé' },
] as const

export const EVENT_TYPE_OPTIONS = [
  { value: 'Réunion', label: 'Réunion', color: '#58a6ff' },
  { value: 'Livraison', label: 'Livraison', color: '#3fb950' },
  { value: 'Deadline', label: 'Deadline', color: '#f85149' },
  { value: 'Review', label: 'Review', color: '#d29922' },
  { value: 'Formation', label: 'Formation', color: '#a371f7' },
] as const

// ============================================
// Configuration AG Grid
// ============================================

export const GRID_CONFIG = {
  headerHeight: 45,
  rowHeight: 50,
  subscriptionHeaderHeight: 40,
  subscriptionRowHeight: 42,
  pagination: true,
  paginationPageSize: 10,
} as const

// ============================================
// Classes CSS pour les statuts
// ============================================

export const STATUS_CLASSES = {
  'En attente': 'status-pending',
  'En cours': 'status-active',
  'Terminé': 'status-completed',
} as const

export const PAYMENT_CLASSES = {
  'Impayé': 'payment-unpaid',
  'Partiel': 'payment-partial',
  'Payé': 'payment-paid',
} as const

export const PRIORITY_CLASSES = {
  'Basse': 'priority-low',
  'Moyenne': 'priority-medium',
  'Haute': 'priority-high',
} as const

export const SUBSCRIPTION_STATUS_CLASSES = {
  'Actif': 'status-active',
  'Suspendu': 'status-pending',
  'Annulé': 'status-completed',
} as const

// ============================================
// Valeurs par défaut
// ============================================

export const DEFAULT_CLIENT = {
  clientName: '',
  contactPerson: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  city: '',
  projectType: '',
  technologies: '',
  budget: 0,
  status: 'En attente' as const,
  progress: 0,
  notes: '',
  website: '',
  logo: '',
  paid: 0,
  paymentStatus: 'Impayé' as const,
  priority: 'Moyenne' as const,
}

export const DEFAULT_SUBSCRIPTION = {
  clientId: 0,
  name: '',
  cost: 0,
  billingCycle: 'Mensuel' as const,
  status: 'Actif' as const,
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  notes: '',
}

export const DEFAULT_EVENT = {
  title: '',
  start: '',
  end: '',
  client: '',
  type: 'Réunion' as const,
  description: '',
  backgroundColor: '#58a6ff',
}

// ============================================
// Configuration API
// ============================================

export const API_BASE_URL = 'http://localhost:3333'

// ============================================
// Messages d'erreur
// ============================================

export const ERROR_MESSAGES = {
  FETCH_CLIENTS: 'Erreur lors de la récupération des clients',
  CREATE_CLIENT: 'Erreur lors de la création du client',
  UPDATE_CLIENT: 'Erreur lors de la mise à jour du client',
  DELETE_CLIENT: 'Erreur lors de la suppression du client',
  FETCH_SUBSCRIPTIONS: 'Erreur lors de la récupération des abonnements',
  CREATE_SUBSCRIPTION: 'Erreur lors de la création de l\'abonnement',
  UPDATE_SUBSCRIPTION: 'Erreur lors de la mise à jour de l\'abonnement',
  DELETE_SUBSCRIPTION: 'Erreur lors de la suppression de l\'abonnement',
} as const

// ============================================
// Messages de succès
// ============================================

export const SUCCESS_MESSAGES = {
  CLIENT_CREATED: 'Client créé avec succès',
  CLIENT_UPDATED: 'Client mis à jour avec succès',
  CLIENT_DELETED: 'Client supprimé avec succès',
  SUBSCRIPTION_CREATED: 'Abonnement créé avec succès',
  SUBSCRIPTION_UPDATED: 'Abonnement mis à jour avec succès',
  SUBSCRIPTION_DELETED: 'Abonnement supprimé avec succès',
} as const
