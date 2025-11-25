import { useState, useRef } from 'react'
import { usePrompts } from '../hooks/usePrompts'
import PromptModal from './PromptModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import { Prompt } from '../types'
import { defaultPrompts } from '../data/prompts'

interface PromptsLibraryProps {
  onUploadComplete?: () => void
}

function PromptsLibrary({ onUploadComplete }: PromptsLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const { prompts, categories, isLoading, createPrompt, updatePrompt, deletePrompt } = usePrompts(debouncedSearch, categoryFilter)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | undefined>()
  const [promptToDelete, setPromptToDelete] = useState<Prompt | undefined>()

  // Debounce search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(value)
    }, 300)
  }

  const handleCreatePrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    await createPrompt(promptData)
    setIsModalOpen(false)
    if (onUploadComplete) {
      onUploadComplete()
    }
  }

  const handleUpdatePrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedPrompt?.id) {
      await updatePrompt(selectedPrompt.id, promptData)
      setIsModalOpen(false)
      setSelectedPrompt(undefined)
    }
  }

  const handleDeletePrompt = async () => {
    if (promptToDelete?.id) {
      await deletePrompt(promptToDelete.id)
      setIsDeleteModalOpen(false)
      setPromptToDelete(undefined)
    }
  }

  const handleCopyPrompt = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
    }
  }

  const handleViewPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setIsViewModalOpen(true)
  }

  const handleEditPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (prompt: Prompt) => {
    setPromptToDelete(prompt)
    setIsDeleteModalOpen(true)
  }

  const handleImportDefaultPrompts = async () => {
    try {
      for (const prompt of defaultPrompts) {
        await createPrompt({
          title: prompt.title,
          category: prompt.category,
          content: prompt.content
        })
      }
    } catch (error) {
      console.error('Erreur lors de l\'import des prompts:', error)
    }
  }

  return (
    <div style={{
      padding: '24px',
      minHeight: '100vh',
      background: '#0d1117'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#e6edf3',
            margin: '0 0 8px 0'
          }}>
            Bibliothèque de Prompts
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#8b949e',
            margin: 0
          }}>
            {prompts.length} prompt{prompts.length > 1 ? 's' : ''} disponible{prompts.length > 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {prompts.length === 0 && (
            <button
              onClick={handleImportDefaultPrompts}
              style={{
                background: '#21262d',
                border: '1px solid #30363d',
                borderRadius: '6px',
                padding: '10px 20px',
                color: '#c9d1d9',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#30363d'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#21262d'}
            >
              Importer prompts par défaut
            </button>
          )}
          <button
            onClick={() => {
              setSelectedPrompt(undefined)
              setIsModalOpen(true)
            }}
            style={{
            background: '#21262d',
            border: '1px solid #30363d',
            borderRadius: '6px',
            padding: '10px 20px',
            color: '#c9d1d9',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#30363d'
            e.currentTarget.style.borderColor = '#58a6ff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#21262d'
            e.currentTarget.style.borderColor = '#30363d'
          }}
          >
            + Nouveau Prompt
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Rechercher un prompt..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
            background: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '6px',
            padding: '10px 12px',
            color: '#c9d1d9',
            fontSize: '14px'
          }}
        />

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            background: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '6px',
            padding: '10px 12px',
            color: '#c9d1d9',
            fontSize: '14px',
            minWidth: '180px',
            cursor: 'pointer'
          }}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {(searchQuery || categoryFilter) && (
          <button
            onClick={() => {
              setSearchQuery('')
              setDebouncedSearch('')
              setCategoryFilter('')
            }}
            style={{
              background: '#21262d',
              border: '1px solid #30363d',
              borderRadius: '6px',
              padding: '10px 16px',
              color: '#8b949e',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#30363d'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#21262d'}
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 0'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #30363d',
            borderTop: '3px solid #58a6ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      ) : prompts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: '#8b949e'
        }}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>
            {searchQuery || categoryFilter ? 'Aucun prompt trouvé' : 'Aucun prompt disponible'}
          </p>
          <p style={{ fontSize: '14px' }}>
            {searchQuery || categoryFilter ? 'Essayez de modifier vos critères de recherche' : 'Commencez par créer votre premier prompt'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              style={{
                background: 'linear-gradient(135deg, #161b22 0%, #1c2128 100%)',
                border: '1px solid #30363d',
                borderRadius: '12px',
                padding: '16px',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onClick={() => handleViewPrompt(prompt)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#58a6ff'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(88, 166, 255, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#30363d'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div style={{
                  flex: 1,
                  overflow: 'hidden'
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#e6edf3',
                    margin: '0 0 4px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {prompt.title}
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    background: '#21262d',
                    border: '1px solid #30363d',
                    borderRadius: '4px',
                    color: '#8b949e',
                    fontWeight: 500
                  }}>
                    {prompt.category}
                  </span>
                </div>
              </div>

              {/* Content Preview */}
              <p style={{
                fontSize: '13px',
                color: '#8b949e',
                margin: '0 0 12px 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.5'
              }}>
                {prompt.content}
              </p>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '8px',
                borderTop: '1px solid #21262d',
                paddingTop: '12px'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopyPrompt(prompt.content)
                  }}
                  style={{
                    flex: 1,
                    background: '#21262d',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#8b949e',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#30363d'
                    e.currentTarget.style.color = '#c9d1d9'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#21262d'
                    e.currentTarget.style.color = '#8b949e'
                  }}
                >
                  Copier
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditPrompt(prompt)
                  }}
                  style={{
                    flex: 1,
                    background: '#21262d',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#8b949e',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#30363d'
                    e.currentTarget.style.color = '#c9d1d9'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#21262d'
                    e.currentTarget.style.color = '#8b949e'
                  }}
                >
                  Modifier
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick(prompt)
                  }}
                  style={{
                    background: '#21262d',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#8b949e',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#da3633'
                    e.currentTarget.style.borderColor = '#da3633'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#21262d'
                    e.currentTarget.style.borderColor = '#30363d'
                    e.currentTarget.style.color = '#8b949e'
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <PromptModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPrompt(undefined)
        }}
        onSubmit={selectedPrompt ? handleUpdatePrompt : handleCreatePrompt}
        editData={selectedPrompt}
      />

      <PromptModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedPrompt(undefined)
        }}
        editData={selectedPrompt}
        viewOnly
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setPromptToDelete(undefined)
        }}
        onConfirm={handleDeletePrompt}
        itemName={promptToDelete?.title || 'ce prompt'}
      />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default PromptsLibrary
