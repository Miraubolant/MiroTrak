import { useState, useEffect, useCallback } from 'react'
import { subscriptionsAPI } from '../services/api'
import { Subscription } from '../types'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants'
import toast from 'react-hot-toast'

/**
 * Hook personnalisé pour la gestion des abonnements
 * Suit le principe de Single Responsibility - gère uniquement la logique des abonnements
 */
export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupérer tous les abonnements
  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await subscriptionsAPI.getAll()
      setSubscriptions(data)
    } catch (err) {
      setError(ERROR_MESSAGES.FETCH_SUBSCRIPTIONS)
      console.error(ERROR_MESSAGES.FETCH_SUBSCRIPTIONS, err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Créer un abonnement
  const createSubscription = useCallback(async (subscriptionData: Omit<Subscription, 'id'>) => {
    try {
      const newSubscription = await subscriptionsAPI.create(subscriptionData)
      setSubscriptions(prev => [...prev, newSubscription])
      toast.success(SUCCESS_MESSAGES.SUBSCRIPTION_CREATED)
      return newSubscription
    } catch (err) {
      toast.error(ERROR_MESSAGES.CREATE_SUBSCRIPTION)
      throw err
    }
  }, [])

  // Mettre à jour un abonnement
  const updateSubscription = useCallback(async (id: number, subscriptionData: Partial<Subscription>) => {
    try {
      const updatedSubscription = await subscriptionsAPI.update(id, subscriptionData)
      setSubscriptions(prev => prev.map(s => s.id === id ? updatedSubscription : s))
      toast.success(SUCCESS_MESSAGES.SUBSCRIPTION_UPDATED)
      return updatedSubscription
    } catch (err) {
      toast.error(ERROR_MESSAGES.UPDATE_SUBSCRIPTION)
      throw err
    }
  }, [])

  // Supprimer un abonnement
  const deleteSubscription = useCallback(async (id: number) => {
    try {
      await subscriptionsAPI.delete(id)
      setSubscriptions(prev => prev.filter(s => s.id !== id))
      toast.success(SUCCESS_MESSAGES.SUBSCRIPTION_DELETED)
    } catch (err) {
      toast.error(ERROR_MESSAGES.DELETE_SUBSCRIPTION)
      throw err
    }
  }, [])

  // Calculer le coût total mensuel
  const totalMonthlyCost = useCallback(() => {
    return subscriptions
      .filter(s => s.status === 'Actif')
      .reduce((total, s) => {
        switch (s.billingCycle) {
          case 'Mensuel': return total + s.cost
          case 'Trimestriel': return total + (s.cost / 3)
          case 'Annuel': return total + (s.cost / 12)
          default: return total
        }
      }, 0)
  }, [subscriptions])

  // Charger les abonnements au montage
  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  return {
    subscriptions,
    isLoading,
    error,
    totalMonthlyCost,
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  }
}
