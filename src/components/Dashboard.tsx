import { useEffect, useRef, useState } from 'react'
import { createGrid, GridOptions, ModuleRegistry, AllCommunityModule, GridApi, ColDef } from 'ag-grid-community'
import { rowData as initialData } from '../data/sampleData'
import { columnDefs as initialColumnDefs } from '../config/gridConfig'
import { clientsAPI, settingsAPI, stackTechniqueAPI, Client, Setting } from '../services/api'
import ClientModal from './ClientModal'
import { SettingsModal } from './settings'
import DeleteConfirmModal from './DeleteConfirmModal'
import StackTechniqueModal, { StackData } from './StackTechniqueModal'
import TemplatesModal from './TemplatesModal'
import ProfileModal from './ProfileModal'
import Calendar from './Calendar'
import Sidebar from './Sidebar'
import BudgetSection from './BudgetSection'
import PromptsLibrary from './PromptsLibrary'
import AiImagesLibrary from './AiImagesLibrary'
import RecentActivity from './RecentActivity'
import PromptModal from './PromptModal'
import AiImageModal from './AiImageModal'
import GlobalSearch from './GlobalSearch'

// Enregistrer les modules AG Grid
ModuleRegistry.registerModules([AllCommunityModule])

interface DashboardProps {
  onLogout: () => void
}

function Dashboard({ onLogout }: DashboardProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const gridApiRef = useRef<GridApi | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isStackTechniqueOpen, setIsStackTechniqueOpen] = useState(false)
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isCalendarVisible, setIsCalendarVisible] = useState(true)
  const [isBudgetVisible, setIsBudgetVisible] = useState(true)
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [editData, setEditData] = useState<any>(null)
  const [selectedClientForTemplate, setSelectedClientForTemplate] = useState<any>(null)
  const [isPromptsLibraryOpen, setIsPromptsLibraryOpen] = useState(false)
  const [isAiImagesLibraryOpen, setIsAiImagesLibraryOpen] = useState(false)
  const [selectedPromptForView, setSelectedPromptForView] = useState<any>(null)
  const [selectedPhotoForView, setSelectedPhotoForView] = useState<any>(null)
  const [recentActivityRefresh, setRecentActivityRefresh] = useState(0)
  const [focusField, setFocusField] = useState<string>('')
  const [clients, setClients] = useState(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [searchSuggestions, setSearchSuggestions] = useState<{type: 'image' | 'prompt', data: any}[]>([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [stackTechnique, setStackTechnique] = useState<StackData | undefined>(undefined)
  const [customLinks, setCustomLinks] = useState<Array<{id: string, name: string, url: string, icon: string}>>([
    { id: '1', name: 'GitHub', url: 'https://github.com', icon: '💻' },
    { id: '2', name: 'Documentation', url: 'https://docs.anthropic.com', icon: '📚' },
  ])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [username, setUsername] = useState('Victor Mirault')
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'clientName',
    'contactPerson',
    'email',
    'phone',
    'projectType',
    'budget'
  ])
  const [columnDefs, setColumnDefs] = useState(() =>
    initialColumnDefs.map(col => {
      if (!col.field) return col
      const defaultVisible = ['clientName', 'contactPerson', 'email', 'phone', 'projectType', 'budget']
      return {
        ...col,
        hide: col.field === 'id' || !defaultVisible.includes(col.field)
      }
    })
  )

  const handleEditClient = (data: any, field?: string) => {
    setEditData(data)
    setFocusField(field || '')
    setIsModalOpen(true)
  }

  const handleDeleteClient = (data: any) => {
    setDeleteTarget(data)
    setIsDeleteModalOpen(true)
  }

  const handleFilterClients = (query: string) => {
    if (!gridApiRef.current) return
    gridApiRef.current.setGridOption('quickFilterText', query)
  }

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await clientsAPI.delete(deleteTarget.id)
        setClients(prev => prev.filter(client => client.id !== deleteTarget.id))
        setDeleteTarget(null)
      } catch (error) {
        console.error('Erreur lors de la suppression du client:', error)
      }
    }
  }

  // Charger les clients depuis l'API au montage du composant
  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true)
        const data = await clientsAPI.getAll()
        setClients(data.map(client => ({
          ...client,
          lastUpdate: client.updatedAt ? new Date(client.updatedAt).toLocaleDateString('fr-FR') : ''
        })))
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error)
        // En cas d'erreur, utiliser les données locales
        setClients(initialData)
      } finally {
        setIsLoading(false)
      }
    }

    loadClients()
  }, [])

  // Recherche avec suggestions
  useEffect(() => {
    const loadSearchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchSuggestions([])
        setShowSearchDropdown(false)
        return
      }

      try {
        const [photos, prompts] = await Promise.all([
          aiPhotosAPI.getAll(),
          promptsAPI.getAll()
        ])

        const query = searchQuery.toLowerCase()
        const suggestions: {type: 'image' | 'prompt', data: any}[] = []

        // Rechercher dans les images
        photos.forEach(photo => {
          if (photo.name?.toLowerCase().includes(query) || 
              photo.imagePrompt?.toLowerCase().includes(query)) {
            suggestions.push({ type: 'image', data: photo })
          }
        })

        // Rechercher dans les prompts
        prompts.forEach(prompt => {
          if (prompt.title?.toLowerCase().includes(query) || 
              prompt.content?.toLowerCase().includes(query)) {
            suggestions.push({ type: 'prompt', data: prompt })
          }
        })

        setSearchSuggestions(suggestions.slice(0, 8))
        setShowSearchDropdown(suggestions.length > 0)
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
      }
    }

    const debounce = setTimeout(loadSearchSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  // Charger les paramètres depuis l'API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsAPI.getAll()

        // Charger les colonnes visibles
        const visibleColumnsSetting = settings.find(s => s.key === 'visible_columns')
        if (visibleColumnsSetting) {
          const columns = JSON.parse(visibleColumnsSetting.value)
          setVisibleColumns(columns)
          handleColumnVisibilityChange(columns)
        }

        // Charger les liens personnalisés
        const customLinksSetting = settings.find(s => s.key === 'custom_links')
        if (customLinksSetting) {
          setCustomLinks(JSON.parse(customLinksSetting.value))
        }

        // Charger la stack technique
        const stackSetting = settings.find(s => s.key === 'stack_technique')
        if (stackSetting) {
          setStackTechnique(JSON.parse(stackSetting.value))
        }

        // Charger le nom d'utilisateur
        const usernameSetting = settings.find(s => s.key === 'username')
        if (usernameSetting) {
          setUsername(usernameSetting.value)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error)
      }
    }

    loadSettings()
  }, [])

  const handleColumnVisibilityChange = async (visibleFields: string[]) => {
    setVisibleColumns(visibleFields)

    // Mettre à jour immédiatement les définitions de colonnes
    const updatedColumns = initialColumnDefs.map(col => {
      if (!col.field) return col
      return {
        ...col,
        hide: !visibleFields.includes(col.field)
      }
    })
    setColumnDefs(updatedColumns)

    // Mettre à jour la grille via l'API si elle existe
    if (gridApiRef.current) {
      gridApiRef.current.setGridOption('columnDefs', updatedColumns)
    }

    // Sauvegarder dans l'API
    try {
      await settingsAPI.save({
        key: 'visible_columns',
        value: JSON.stringify(visibleFields),
        type: 'json',
        description: 'Colonnes visibles dans la grille'
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des colonnes:', error)
    }
  }

  const getColumnList = () => {
    return initialColumnDefs
      .filter(col => col.field && col.headerName)
      .map(col => ({
        field: col.field as string,
        headerName: col.headerName as string,
        visible: visibleColumns.includes(col.field as string)
      }))
  }

  const handleApplyLinks = async (links: Array<{id: string, name: string, url: string, icon: string}>) => {
    setCustomLinks(links)
    
    // Sauvegarder dans l'API
    try {
      await settingsAPI.save({
        key: 'custom_links',
        value: JSON.stringify(links),
        type: 'json',
        description: 'Liens personnalisés de la sidebar'
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des liens:', error)
    }
  }

  const handleSaveStackTechnique = async (stackData: StackData) => {
    try {
      await stackTechniqueAPI.save(stackData)
      setStackTechnique(stackData)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la stack technique:', error)
    }
  }

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K : Focus recherche
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      // N : Nouveau client (si pas dans un input)
      if (e.key === 'n' && !(e.target as HTMLElement).matches('input, textarea, select')) {
        e.preventDefault()
        setIsModalOpen(true)
      }
      // Escape : Fermer recherche si vide
      if (e.key === 'Escape' && searchQuery === '') {
        searchInputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchQuery])

  const filteredClients = clients.filter(client => {
    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase()
    return (
      client.clientName?.toLowerCase().includes(query) ||
      client.contactPerson?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.phone?.toLowerCase().includes(query) ||
      client.projectType?.toLowerCase().includes(query) ||
      client.technologies?.toLowerCase().includes(query) ||
      client.status?.toLowerCase().includes(query) ||
      client.notes?.toLowerCase().includes(query)
    )
  })

  const handleRowDragEnd = (event: any) => {
    const movingData = event.node.data
    const overIndex = event.overIndex

    if (overIndex === undefined) return

    const newData = [...clients]
    const fromIndex = newData.findIndex(item => item.id === movingData.id)
    const [movedItem] = newData.splice(fromIndex, 1)
    newData.splice(overIndex, 0, movedItem)

    setClients(newData)
  }

  useEffect(() => {
    if (!gridRef.current) return

    // Calculer les totaux
    const totalBudget = filteredClients.reduce((sum, client) => sum + (parseFloat(client.budget as any) || 0), 0)
    const totalPaid = filteredClients.reduce((sum, client) => sum + (parseFloat(client.paid as any) || 0), 0)
    const avgProgress = filteredClients.length > 0 
      ? Math.round(filteredClients.reduce((sum, client) => sum + (client.progress || 0), 0) / filteredClients.length)
      : 0

    const gridOptions: GridOptions = {
      columnDefs,
      rowData: filteredClients,
      context: {
        onEdit: handleEditClient,
        onDelete: handleDeleteClient,
        onTemplate: (data: any) => {
          setSelectedClientForTemplate(data)
          setIsTemplatesOpen(true)
        },
      },
      rowSelection: {
        mode: 'multiRow',
        checkboxes: false,
        headerCheckbox: false,
      },
      rowDragEntireRow: true,
      animateRows: true,
      onRowDragEnd: handleRowDragEnd,
      domLayout: 'autoHeight',
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        filter: true,
        sortable: true,
        resizable: true,
        editable: (params) => {
          return params.colDef.field !== 'id' && params.colDef.field !== 'lastUpdate'
        },
      },
      pinnedBottomRowData: [
        {
          id: 'total',
          clientName: 'TOTAL',
          contactPerson: '',
          email: '',
          phone: '',
          projectType: '',
          status: '',
          budget: totalBudget,
          paid: totalPaid,
          progress: avgProgress,
          startDate: '',
          endDate: '',
          lastUpdate: ''
        }
      ],
      onCellValueChanged: async (event) => {
        try {
          const updatedClient = {
            ...event.data,
            lastUpdate: new Date().toLocaleDateString('fr-FR')
          }
          
          // Mettre à jour dans l'API
          await clientsAPI.update(event.data.id, updatedClient)
          
          // Mettre à jour l'état local
          const updatedClients = clients.map(client =>
            client.id === event.data.id ? updatedClient : client
          )
          setClients(updatedClients)
        } catch (error) {
          console.error('Erreur lors de la mise à jour du client:', error)
        }
      },
    }

    const gridApi = createGrid(gridRef.current, gridOptions)
    gridApiRef.current = gridApi

    return () => {
      if (gridApi) {
        gridApi.destroy()
      }
    }
  }, [clients, columnDefs, searchQuery])

  // Gestion de la touche ESC pour fermer la bibliothèque de Prompts
  useEffect(() => {
    if (!isPromptsLibraryOpen) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPromptsLibraryOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isPromptsLibraryOpen])

  // Gestion de la touche ESC pour fermer la bibliothèque d'Images IA
  useEffect(() => {
    if (!isAiImagesLibraryOpen) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAiImagesLibraryOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isAiImagesLibraryOpen])

  const handleAddClient = async (clientData: any) => {
    try {
      if (editData) {
        // Mode édition
        const updated = await clientsAPI.update(clientData.id, clientData)
        setClients(prev => prev.map(client =>
          client.id === clientData.id ? { ...updated, lastUpdate: new Date(updated.updatedAt || '').toLocaleDateString('fr-FR') } : client
        ))
        setEditData(null)
        setIsModalOpen(false)
      } else {
        // Mode ajout
        const newClient = await clientsAPI.create(clientData)
        setClients(prev => [...prev, { ...newClient, lastUpdate: new Date(newClient.updatedAt || '').toLocaleDateString('fr-FR') }])
        setIsModalOpen(false)
      }
      setFocusField('')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du client:', error)
    }
  }

  return (
    <div className="dashboard">
      {isLoading ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#0d1117',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #30363d',
              borderTop: '4px solid #58a6ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{
              `@keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }`
            }</style>
            <p style={{ color: '#8b949e', fontSize: '14px' }}>Chargement...</p>
          </div>
        </div>
      ) : (
        <>
      <header className={`dashboard-header ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="header-center">
          <GlobalSearch
            onSelectImage={(photo) => setSelectedPhotoForView(photo)}
            onSelectPrompt={(prompt) => setSelectedPromptForView(prompt)}
            onSelectClient={(client) => {
              setEditData(client)
              setIsModalOpen(true)
            }}
            onFilterClients={handleFilterClients}
          />
        </div>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Stats rapides */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            paddingRight: '16px',
            borderRight: '1px solid #21262d'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#58a6ff',
                fontFamily: 'monospace',
                lineHeight: 1
              }}>
                {clients.length}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#8b949e',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Clients
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#56d364',
                fontFamily: 'monospace',
                lineHeight: 1
              }}>
                {clients.reduce((sum, client) => sum + (parseFloat(client.budget as any) || 0), 0).toLocaleString('fr-FR')}€
              </div>
              <div style={{
                fontSize: '10px',
                color: '#8b949e',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Gain total
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#f78166',
                fontFamily: 'monospace',
                lineHeight: 1
              }}>
                {clients.reduce((sum, client) => sum + (parseFloat(client.paid as any) || 0), 0).toLocaleString('fr-FR')}€
              </div>
              <div style={{
                fontSize: '10px',
                color: '#8b949e',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Abo/mois
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
              title="Ajouter"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: '#21262d',
                border: '1px solid #30363d',
                borderRadius: '6px',
                color: '#e6edf3',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 0 0 0 rgba(48, 54, 61, 0)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
                e.currentTarget.style.background = '#30363d'
                e.currentTarget.style.borderColor = '#484f58'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 0 0 rgba(48, 54, 61, 0)'
                e.currentTarget.style.background = '#21262d'
                e.currentTarget.style.borderColor = '#30363d'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nouveau
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', transition: 'transform 0.2s', transform: isAddMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {isAddMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                minWidth: '200px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => {
                    setIsModalOpen(true)
                    setIsAddMenuOpen(false)
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#21262d'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Nouveau Client
                </button>
                <button
                  onClick={() => {
                    setIsSubscriptionModalOpen(true)
                    setIsAddMenuOpen(false)
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#21262d'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  Nouvel Abonnement
                </button>
                <button
                  onClick={() => {
                    setIsEventModalOpen(true)
                    setIsAddMenuOpen(false)
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#21262d'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Nouvel Événement
                </button>
              </div>
            )}
          </div>
          
          <button
            className="header-btn"
            onClick={() => setIsSettingsOpen(true)}
            title="Paramètres"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
          
          <div className="user-menu-wrapper">
            <button
              className="header-btn user-menu-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              title="Menu utilisateur"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            {isUserMenuOpen && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="user-info">
                    <div className="user-name">{username}</div>
                    <div className="user-email">contact@mirotrak.com</div>
                  </div>
                </div>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item" onClick={() => {
                  setIsProfileOpen(true)
                  setIsUserMenuOpen(false)
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>Mon Profil</span>
                </button>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item logout" onClick={onLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Sidebar
        customLinks={customLinks}
        onToggle={setIsSidebarCollapsed}
        onOpenPromptsLibrary={() => setIsPromptsLibraryOpen(true)}
        onOpenAiImagesLibrary={() => setIsAiImagesLibraryOpen(true)}
      />

      <main className={`dashboard-main with-sidebar ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="container">
          {/* Tableau des Clients */}
          <div style={{ marginBottom: '32px' }}>
            <div ref={gridRef} className="ag-theme-quartz" style={{ 
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #30363d'
            }}></div>
          </div>

          {/* Grille: Abonnements + Activité Récente | Calendrier */}
          {(isCalendarVisible || isBudgetVisible) && (
            <div style={{ marginBottom: '32px' }}>
              <div className="dashboard-grid" style={{
                display: 'grid',
                gridTemplateColumns: isCalendarVisible && isBudgetVisible ? '1fr 1fr' : '1fr',
                gap: '24px',
                alignItems: 'stretch',
                height: '800px'
              }}>
                {/* Colonne gauche: Abonnements + Images IA + Prompts */}
                {isBudgetVisible && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    height: '100%'
                  }}>
                    {/* Abonnements */}
                    <div style={{ flex: '0 0 auto' }}>
                      <BudgetSection
                        clients={clients}
                        isModalOpen={isSubscriptionModalOpen}
                        onOpenModal={() => setIsSubscriptionModalOpen(true)}
                        onCloseModal={() => setIsSubscriptionModalOpen(false)}
                      />
                    </div>
                    
                    {/* Section Activité Récente (Images IA et Prompts) */}
                    <div style={{ flex: 1, minHeight: 0 }}>
                      <RecentActivity
                        onOpenAiImage={(photo) => setSelectedPhotoForView(photo)}
                        onOpenPrompt={(prompt) => setSelectedPromptForView(prompt)}
                        refreshTrigger={recentActivityRefresh}
                      />
                    </div>
                  </div>
                )}

                {/* Calendrier */}
                {isCalendarVisible && (
                  <Calendar
                    isEventModalOpen={isEventModalOpen}
                    onOpenEventModal={() => setIsEventModalOpen(true)}
                    onCloseEventModal={() => setIsEventModalOpen(false)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals d'aperçu */}
      {selectedPromptForView && (
        <PromptModal
          isOpen={true}
          onClose={() => setSelectedPromptForView(null)}
          editData={selectedPromptForView}
          viewOnly={true}
        />
      )}

      {selectedPhotoForView && (
        <AiImageModal
          isOpen={true}
          onClose={() => setSelectedPhotoForView(null)}
          editData={selectedPhotoForView}
          viewOnly={true}
        />
      )}

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditData(null)
          setFocusField('')
        }}
        onSubmit={handleAddClient}
        editData={editData}
        focusField={focusField}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        columns={getColumnList()}
        onApplyColumns={handleColumnVisibilityChange}
        customLinks={customLinks}
        onApplyLinks={handleApplyLinks}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={confirmDelete}
        clientName={deleteTarget?.clientName || ''}
      />

      <StackTechniqueModal
        isOpen={isStackTechniqueOpen}
        onClose={() => setIsStackTechniqueOpen(false)}
        onSave={handleSaveStackTechnique}
        initialData={stackTechnique}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        clientData={selectedClientForTemplate}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenStackTechnique={() => {
          setIsProfileOpen(false)
          setIsStackTechniqueOpen(true)
        }}
        onUsernameUpdate={(newUsername) => setUsername(newUsername)}
      />

      {/* Bibliothèque de Prompts en Modal */}
      {isPromptsLibraryOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsPromptsLibraryOpen(false)}
        >
          <div 
            style={{
              background: '#0d1117',
              borderRadius: '12px',
              border: '1px solid #30363d',
              width: '95%',
              height: '90vh',
              maxWidth: '1600px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #21262d',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#e6edf3',
                margin: 0
              }}>
                Bibliothèque de Prompts
              </h2>
              <button
                onClick={() => setIsPromptsLibraryOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8b949e',
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: '0',
                  lineHeight: '1',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#e6edf3'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8b949e'}
              >
                ×
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <PromptsLibrary onUploadComplete={() => setRecentActivityRefresh(prev => prev + 1)} />
            </div>
          </div>
        </div>
      )}

      {/* Bibliothèque d'Images IA en Modal */}
      {isAiImagesLibraryOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsAiImagesLibraryOpen(false)}
        >
          <div 
            style={{
              background: '#0d1117',
              borderRadius: '12px',
              border: '1px solid #30363d',
              width: '95%',
              height: '90vh',
              maxWidth: '1800px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #21262d',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#e6edf3',
                margin: 0
              }}>
                Bibliothèque d'Images IA
              </h2>
              <button
                onClick={() => setIsAiImagesLibraryOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8b949e',
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: '0',
                  lineHeight: '1',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#e6edf3'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8b949e'}
              >
                ×
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <AiImagesLibrary onUploadComplete={() => setRecentActivityRefresh(prev => prev + 1)} />
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  )
}

export default Dashboard
