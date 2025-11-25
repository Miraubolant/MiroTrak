import { useState, useEffect, useCallback } from 'react'
import { clientsAPI } from '../services/api'
import { Client } from '../types'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants'
import toast from 'react-hot-toast'

/**
 * Hook personnalisé pour la gestion des clients
 * Suit le principe de Single Responsibility - gère uniquement la logique des clients
 */
export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupérer tous les clients
  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await clientsAPI.getAll()
      setClients(data)
    } catch (err) {
      setError(ERROR_MESSAGES.FETCH_CLIENTS)
      console.error(ERROR_MESSAGES.FETCH_CLIENTS, err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Créer un client
  const createClient = useCallback(async (clientData: Omit<Client, 'id'>) => {
    try {
      const newClient = await clientsAPI.create(clientData)
      setClients(prev => [...prev, newClient])
      toast.success(SUCCESS_MESSAGES.CLIENT_CREATED)
      return newClient
    } catch (err) {
      toast.error(ERROR_MESSAGES.CREATE_CLIENT)
      throw err
    }
  }, [])

  // Mettre à jour un client
  const updateClient = useCallback(async (id: number, clientData: Partial<Client>) => {
    try {
      const updatedClient = await clientsAPI.update(id, clientData)
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c))
      toast.success(SUCCESS_MESSAGES.CLIENT_UPDATED)
      return updatedClient
    } catch (err) {
      toast.error(ERROR_MESSAGES.UPDATE_CLIENT)
      throw err
    }
  }, [])

  // Supprimer un client
  const deleteClient = useCallback(async (id: number) => {
    try {
      await clientsAPI.delete(id)
      setClients(prev => prev.filter(c => c.id !== id))
      toast.success(SUCCESS_MESSAGES.CLIENT_DELETED)
    } catch (err) {
      toast.error(ERROR_MESSAGES.DELETE_CLIENT)
      throw err
    }
  }, [])

  // Charger les clients au montage
  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  }
}
