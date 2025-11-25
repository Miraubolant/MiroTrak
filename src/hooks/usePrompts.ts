import { useState, useEffect, useCallback } from 'react'
import { promptsAPI } from '../services/api'
import { Prompt } from '../types'

/**
 * Hook personnalisé pour la gestion des prompts
 */
export function usePrompts(searchQuery?: string, categoryFilter?: string) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupérer tous les prompts
  const fetchPrompts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await promptsAPI.getAll(searchQuery, categoryFilter)
      setPrompts(data)
    } catch (err) {
      setError('Erreur lors du chargement des prompts')
      console.error('Erreur lors du chargement des prompts', err)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, categoryFilter])

  // Récupérer les catégories
  const fetchCategories = useCallback(async () => {
    try {
      const data = await promptsAPI.getCategories()
      setCategories(data)
    } catch (err) {
      console.error('Erreur lors du chargement des catégories', err)
    }
  }, [])

  // Créer un prompt
  const createPrompt = useCallback(async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPrompt = await promptsAPI.create(promptData)
      setPrompts(prev => [newPrompt, ...prev])
      return newPrompt
    } catch (err) {
      console.error('Erreur lors de la création du prompt', err)
      throw err
    }
  }, [])

  // Mettre à jour un prompt
  const updatePrompt = useCallback(async (id: number, promptData: Partial<Prompt>) => {
    try {
      const updatedPrompt = await promptsAPI.update(id, promptData)
      setPrompts(prev => prev.map(p => p.id === id ? updatedPrompt : p))
      return updatedPrompt
    } catch (err) {
      console.error('Erreur lors de la mise à jour du prompt', err)
      throw err
    }
  }, [])

  // Supprimer un prompt
  const deletePrompt = useCallback(async (id: number) => {
    try {
      await promptsAPI.delete(id)
      setPrompts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Erreur lors de la suppression du prompt', err)
      throw err
    }
  }, [])

  // Charger les prompts au montage ou quand les filtres changent
  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  // Charger les catégories au montage
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    prompts,
    categories,
    isLoading,
    error,
    fetchPrompts,
    createPrompt,
    updatePrompt,
    deletePrompt,
  }
}
