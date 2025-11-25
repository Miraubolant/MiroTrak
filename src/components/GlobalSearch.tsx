import { useState, useEffect, useRef } from 'react'
import { aiPhotosAPI, promptsAPI, clientsAPI } from '../services/api'
import { AiPhoto, Prompt, Client } from '../types'

interface GlobalSearchProps {
  onSelectImage: (photo: AiPhoto) => void
  onSelectPrompt: (prompt: Prompt) => void
  onSelectClient: (client: Client) => void
  onFilterClients: (query: string) => void
}

interface SearchResult {
  type: 'image' | 'prompt' | 'client' | 'subscription'
  category: string
  data: any
  matchedField?: string
}

function GlobalSearch({ onSelectImage, onSelectPrompt, onSelectClient, onFilterClients }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Cache pour stocker les données
  const [cachedData, setCachedData] = useState<{
    photos: AiPhoto[]
    prompts: Prompt[]
    clients: Client[]
    lastFetch: number
  } | null>(null)
  const CACHE_DURATION = 30000 // 30 secondes

  // Pré-charger les données au montage
  useEffect(() => {
    const preloadData = async () => {
      try {
        const [photos, prompts, clients] = await Promise.all([
          aiPhotosAPI.getAll(),
          promptsAPI.getAll(),
          clientsAPI.getAll()
        ])
        setCachedData({
          photos,
          prompts,
          clients,
          lastFetch: Date.now()
        })
      } catch (error) {
        console.error('Erreur lors du préchargement:', error)
      }
    }
    preloadData()
  }, [])

  // Raccourci clavier Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setShowDropdown(false)
        searchInputRef.current?.blur()
      }
      // Ouvrir le premier résultat avec Entrée
      if (e.key === 'Enter' && showDropdown && searchResults.length > 0) {
        e.preventDefault()
        handleResultClick(searchResults[0])
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showDropdown, searchResults])

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Recherche avec debounce
  useEffect(() => {
    const performSearch = async () => {
      const query = searchQuery.trim()
      
      if (query.length < 2) {
        setSearchResults([])
        setShowDropdown(false)
        onFilterClients('') // Reset filter
        return
      }

      setIsLoading(true)
      try {
        // Utiliser le cache ou recharger si expiré
        let photos, prompts, clients
        if (cachedData && (Date.now() - cachedData.lastFetch < CACHE_DURATION)) {
          ({ photos, prompts, clients } = cachedData)
        } else {
          [photos, prompts, clients] = await Promise.all([
            aiPhotosAPI.getAll(),
            promptsAPI.getAll(),
            clientsAPI.getAll()
          ])
          setCachedData({ photos, prompts, clients, lastFetch: Date.now() })
        }

        const results: SearchResult[] = []
        const queryLower = query.toLowerCase()
        let resultCount = 0
        const MAX_RESULTS = 10

        // Recherche optimisée avec early exit
        // Rechercher dans les images IA
        for (const photo of photos) {
          if (resultCount >= MAX_RESULTS) break
          const matchedFields: string[] = []
          if (photo.name?.toLowerCase().includes(queryLower)) matchedFields.push('nom')
          if (photo.imagePrompt?.toLowerCase().includes(queryLower)) matchedFields.push('prompt image')
          if (photo.videoPrompt?.toLowerCase().includes(queryLower)) matchedFields.push('prompt vidéo')
          
          if (matchedFields.length > 0) {
            results.push({
              type: 'image',
              category: 'Images IA',
              data: photo,
              matchedField: matchedFields.join(', ')
            })
            resultCount++
          }
        }

        // Rechercher dans les prompts
        for (const prompt of prompts) {
          if (resultCount >= MAX_RESULTS) break
          const matchedFields: string[] = []
          if (prompt.title?.toLowerCase().includes(queryLower)) matchedFields.push('titre')
          if (prompt.content?.toLowerCase().includes(queryLower)) matchedFields.push('contenu')
          if (prompt.category?.toLowerCase().includes(queryLower)) matchedFields.push('catégorie')
          
          if (matchedFields.length > 0) {
            results.push({
              type: 'prompt',
              category: 'Prompts',
              data: prompt,
              matchedField: matchedFields.join(', ')
            })
            resultCount++
          }
        }

        // Rechercher dans les clients
        for (const client of clients) {
          if (resultCount >= MAX_RESULTS) break
          const matchedFields: string[] = []
          if (client.clientName?.toLowerCase().includes(queryLower)) matchedFields.push('nom')
          if (client.contactPerson?.toLowerCase().includes(queryLower)) matchedFields.push('contact')
          if (client.email?.toLowerCase().includes(queryLower)) matchedFields.push('email')
          if (client.phone?.toLowerCase().includes(queryLower)) matchedFields.push('téléphone')
          if (client.projectType?.toLowerCase().includes(queryLower)) matchedFields.push('type de projet')
          if (client.status?.toLowerCase().includes(queryLower)) matchedFields.push('statut')
          
          if (matchedFields.length > 0) {
            results.push({
              type: 'client',
              category: 'Clients',
              data: client,
              matchedField: matchedFields.join(', ')
            })
            resultCount++
          }
        }

        setSearchResults(results)
        setShowDropdown(results.length > 0)
        
        // Filtrer le tableau clients si des résultats clients sont trouvés
        if (results.some(r => r.type === 'client')) {
          onFilterClients(query)
        } else {
          onFilterClients('')
        }
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(performSearch, 200)
    return () => clearTimeout(debounce)
  }, [searchQuery, cachedData])

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'image':
        onSelectImage(result.data)
        break
      case 'prompt':
        onSelectPrompt(result.data)
        break
      case 'client':
      case 'subscription':
        onSelectClient(result.data)
        break
    }
    setShowDropdown(false)
    setSearchQuery('')
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="#a371f7" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        )
      case 'prompt':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        )
      case 'client':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="#56d364" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        )
      case 'subscription':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="#f78166" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        )
      default:
        return null
    }
  }

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'image': return '#a371f7'
      case 'prompt': return '#58a6ff'
      case 'client': return '#56d364'
      case 'subscription': return '#f78166'
      default: return '#8b949e'
    }
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <div className="search-bar" style={{ position: 'relative' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Rechercher partout... (Ctrl+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
          style={{ paddingRight: searchQuery ? '40px' : '16px' }}
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('')
              setShowDropdown(false)
              onFilterClients('')
            }}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#8b949e',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
        {isLoading && (
          <div style={{
            position: 'absolute',
            right: searchQuery ? '44px' : '12px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #30363d',
              borderTop: '2px solid #58a6ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}
      </div>

      {showDropdown && searchResults.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          maxHeight: '500px',
          overflowY: 'auto',
          zIndex: 10000
        }}>
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #21262d',
            fontSize: '12px',
            color: '#8b949e',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
          </div>

          {searchResults.map((result, index) => (
            <div
              key={index}
              onClick={() => handleResultClick(result)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: index < searchResults.length - 1 ? '1px solid #21262d' : 'none',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#21262d'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: result.type === 'image' ? 'transparent' : '#21262d',
                  borderRadius: '8px',
                  border: '1px solid #30363d',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {result.type === 'image' ? (
                    <img
                      src={result.data.imageUrl}
                      alt={result.data.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    getIcon(result.type)
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#e6edf3',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {result.type === 'image' && result.data.name}
                      {result.type === 'prompt' && result.data.title}
                      {(result.type === 'client' || result.type === 'subscription') && result.data.clientName}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: getCategoryColor(result.type),
                      background: `${getCategoryColor(result.type)}15`,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      flexShrink: 0
                    }}>
                      {result.category}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '11px',
                    color: '#8b949e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>Trouvé dans:</span>
                    <span style={{ 
                      color: '#58a6ff',
                      fontWeight: 500
                    }}>
                      {result.matchedField}
                    </span>
                  </div>

                  {result.type === 'prompt' && result.data.content && (
                    <div style={{
                      fontSize: '11px',
                      color: '#6e7681',
                      marginTop: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {result.data.content}
                    </div>
                  )}

                  {(result.type === 'client' || result.type === 'subscription') && (
                    <div style={{
                      fontSize: '11px',
                      color: '#6e7681',
                      marginTop: '4px',
                      display: 'flex',
                      gap: '12px'
                    }}>
                      {result.data.email && <span>{result.data.email}</span>}
                      {result.data.projectType && <span>• {result.data.projectType}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GlobalSearch
