import { useState, useCallback } from 'react'

export interface CustomLink {
  id: string
  name: string
  url: string
  icon: string
  category?: string
}

interface LinkFormState {
  name: string
  url: string
  icon: string
  category: string
}

const DEFAULT_FORM_STATE: LinkFormState = {
  name: '',
  url: '',
  icon: '🔗',
  category: 'Général'
}

interface UseLinksReturn {
  links: CustomLink[]
  setLinks: (links: CustomLink[]) => void
  editingLinkId: string | null
  formState: LinkFormState
  updateFormField: (field: keyof LinkFormState, value: string) => void
  handleAddOrUpdateLink: () => void
  handleEditLink: (link: CustomLink) => void
  handleCancelEdit: () => void
  handleRemoveLink: (id: string) => void
  getCategories: () => string[]
}

export function useLinks(initialLinks: CustomLink[]): UseLinksReturn {
  const [links, setLinks] = useState<CustomLink[]>(initialLinks)
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [formState, setFormState] = useState<LinkFormState>(DEFAULT_FORM_STATE)

  const updateFormField = useCallback((field: keyof LinkFormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormState(DEFAULT_FORM_STATE)
    setEditingLinkId(null)
  }, [])

  const handleAddOrUpdateLink = useCallback(() => {
    if (!formState.name.trim() || !formState.url.trim()) return

    if (editingLinkId) {
      setLinks(prev => prev.map(link =>
        link.id === editingLinkId
          ? { ...link, name: formState.name, url: formState.url, icon: formState.icon, category: formState.category }
          : link
      ))
    } else {
      const newLink: CustomLink = {
        id: Date.now().toString(),
        name: formState.name,
        url: formState.url,
        icon: formState.icon,
        category: formState.category
      }
      setLinks(prev => [...prev, newLink])
    }
    resetForm()
  }, [formState, editingLinkId, resetForm])

  const handleEditLink = useCallback((link: CustomLink) => {
    setEditingLinkId(link.id)
    setFormState({
      name: link.name,
      url: link.url,
      icon: link.icon,
      category: link.category || 'Général'
    })
  }, [])

  const handleCancelEdit = useCallback(() => {
    resetForm()
  }, [resetForm])

  const handleRemoveLink = useCallback((id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id))
    if (editingLinkId === id) {
      resetForm()
    }
  }, [editingLinkId, resetForm])

  const getCategories = useCallback(() => {
    return Array.from(new Set(links.map(l => l.category || 'Général')))
  }, [links])

  return {
    links,
    setLinks,
    editingLinkId,
    formState,
    updateFormField,
    handleAddOrUpdateLink,
    handleEditLink,
    handleCancelEdit,
    handleRemoveLink,
    getCategories
  }
}
