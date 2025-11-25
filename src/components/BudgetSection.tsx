import { useState, useEffect, useRef } from 'react'
import { createGrid, GridOptions, GridApi, ColDef } from 'ag-grid-community'
import type { Client, Subscription } from '../types'

interface BudgetSectionProps {
  clients: Client[]
  isModalOpen: boolean
  onOpenModal: () => void
  onCloseModal: () => void
}

function BudgetSection({ clients, isModalOpen, onOpenModal, onCloseModal }: BudgetSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const gridApiRef = useRef<GridApi | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [editData, setEditData] = useState<Subscription | null>(null)
  const [formData, setFormData] = useState<Subscription>({
    clientId: 0,
    name: '',
    cost: 0,
    billingCycle: 'Mensuel',
    status: 'Actif',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  })

  // Charger les abonnements (pour l'instant données de démo)
  useEffect(() => {
    // TODO: Remplacer par un vrai appel API
    const demoSubscriptions: Subscription[] = [
      {
        id: 1,
        clientId: 1,
        clientName: 'TechCorp',
        name: 'Hébergement Web',
        cost: 29.99,
        billingCycle: 'Mensuel',
        status: 'Actif',
        startDate: '2024-01-01',
        notes: 'Plan Business OVH'
      },
      {
        id: 2,
        clientId: 1,
        clientName: 'TechCorp',
        name: 'Nom de domaine',
        cost: 12.99,
        billingCycle: 'Annuel',
        status: 'Actif',
        startDate: '2024-01-01',
        endDate: '2025-01-01'
      },
      {
        id: 3,
        clientId: 2,
        clientName: 'StartupXYZ',
        name: 'Maintenance',
        cost: 150.00,
        billingCycle: 'Mensuel',
        status: 'Actif',
        startDate: '2024-02-15'
      }
    ]
    setSubscriptions(demoSubscriptions)
  }, [])

  const handleOpenModal = (subscription?: Subscription) => {
    if (subscription) {
      setEditData(subscription)
      setFormData(subscription)
    } else {
      setEditData(null)
      setFormData({
        clientId: clients.length > 0 ? clients[0].id || 0 : 0,
        name: '',
        cost: 0,
        billingCycle: 'Mensuel',
        status: 'Actif',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: ''
      })
    }
    onOpenModal()
  }

  const handleCloseModal = () => {
    onCloseModal()
    setEditData(null)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isModalOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editData) {
      // Mode édition
      const updatedSubscriptions = subscriptions.map(sub =>
        sub.id === editData.id ? { ...formData, id: editData.id, clientName: clients.find(c => c.id === formData.clientId)?.clientName } : sub
      )
      setSubscriptions(updatedSubscriptions)
      if (gridApiRef.current) {
        gridApiRef.current.setGridOption('rowData', updatedSubscriptions)
      }
    } else {
      // Mode ajout
      const newSubscription: Subscription = {
        ...formData,
        id: Date.now(),
        clientName: clients.find(c => c.id === formData.clientId)?.clientName || ''
      }
      const updatedSubscriptions = [...subscriptions, newSubscription]
      setSubscriptions(updatedSubscriptions)
      if (gridApiRef.current) {
        gridApiRef.current.setGridOption('rowData', updatedSubscriptions)
      }
    }

    handleCloseModal()
  }

  const handleDelete = (id: number) => {
    const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id)
    setSubscriptions(updatedSubscriptions)
    if (gridApiRef.current) {
      gridApiRef.current.setGridOption('rowData', updatedSubscriptions)
    }
  }

  // Configuration AG Grid
  useEffect(() => {
    if (!gridRef.current) return

    const columnDefs: ColDef[] = [
      {
        field: 'clientName',
        headerName: 'Client',
        flex: 1,
        minWidth: 150
      },
      {
        field: 'name',
        headerName: 'Nom',
        flex: 1.5,
        minWidth: 200
      },
      {
        field: 'cost',
        headerName: 'Coût',
        width: 120,
        valueFormatter: (params) => `${params.value?.toFixed(2)} €`,
        cellStyle: { color: '#58a6ff', fontWeight: 600, textAlign: 'right' }
      },
      {
        field: 'billingCycle',
        headerName: 'Facturation',
        width: 130
      },
      {
        field: 'status',
        headerName: 'Statut',
        width: 140,
        cellRenderer: (params: any) => {
          const status = params.value
          const statusClass = status === 'Actif' ? 'status-active' :
                             status === 'Suspendu' ? 'status-pending' :
                             status === 'Annulé' ? 'status-completed' : 'status-default'

          const div = document.createElement('div')
          div.innerHTML = `<span class="status-badge ${statusClass}">${status}</span>`
          return div
        }
      },
      {
        field: 'startDate',
        headerName: 'Début',
        width: 120,
        valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString('fr-FR') : ''
      },
      {
        headerName: 'Actions',
        width: 140,
        cellRenderer: (params: any) => {
          const div = document.createElement('div')
          div.className = 'action-buttons'

          // Créer le bouton Edit
          const editBtn = document.createElement('button')
          editBtn.className = 'action-btn edit'
          editBtn.title = 'Modifier'
          editBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          `
          editBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            handleOpenModal(params.data)
          })

          // Créer le bouton Delete
          const deleteBtn = document.createElement('button')
          deleteBtn.className = 'action-btn delete'
          deleteBtn.title = 'Supprimer'
          deleteBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          `
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            handleDelete(params.data.id)
          })

          // Ajouter les boutons directement au conteneur
          div.appendChild(editBtn)
          div.appendChild(deleteBtn)

          return div
        },
        suppressHeaderMenuButton: true,
        sortable: false,
        filter: false,
        editable: false,
        pinned: 'right'
      }
    ]

    const gridOptions: GridOptions = {
      columnDefs,
      rowData: subscriptions,
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true
      },
      domLayout: 'autoHeight',
      headerHeight: 40,
      rowHeight: 42,
      pagination: false,
      suppressMovableColumns: true,
      suppressCellFocus: true,
      onGridReady: (params) => {
        gridApiRef.current = params.api
      }
    }

    const gridApi = createGrid(gridRef.current, gridOptions)

    return () => {
      gridApi?.destroy()
    }
  }, [])

  // Mettre à jour les données quand subscriptions change
  useEffect(() => {
    if (gridApiRef.current) {
      gridApiRef.current.setGridOption('rowData', subscriptions)
    }
  }, [subscriptions])

  return (
    <div style={{ flex: 1 }}>
      {/* AG Grid Table */}
      <div ref={gridRef} className="ag-theme-quartz" style={{ 
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #30363d'
      }}></div>

      {/* Modal d'ajout/édition */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }} onClick={handleCloseModal}>
          <div style={{
            background: '#161b22',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            border: '1px solid #30363d',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                color: '#c9d1d9',
                fontSize: '20px',
                fontWeight: 600,
                margin: 0
              }}>
                {editData ? 'Modifier l\'abonnement' : 'Nouvel abonnement'}
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                  Client *
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientId: parseInt(e.target.value) }))}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value={0}>Sélectionner un client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.clientName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                  Nom de l'abonnement *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Ex: Hébergement Web, Nom de domaine, Maintenance..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                    Coût (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) }))}
                    required
                    placeholder="29.99"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d1117',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      color: '#c9d1d9',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                    Cycle de facturation *
                  </label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData(prev => ({ ...prev, billingCycle: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d1117',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      color: '#c9d1d9',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Mensuel">Mensuel</option>
                    <option value="Trimestriel">Trimestriel</option>
                    <option value="Semestriel">Semestriel</option>
                    <option value="Annuel">Annuel</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                  Statut *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Actif">Actif</option>
                  <option value="Suspendu">Suspendu</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                    Date de début *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d1117',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      color: '#c9d1d9',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d1117',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      color: '#c9d1d9',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                  Notes
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Informations complémentaires..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                paddingTop: '12px',
                borderTop: '1px solid #30363d'
              }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '10px 20px',
                    background: '#21262d',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#30363d'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#21262d'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: '#21262d',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#e6edf3',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
                    e.currentTarget.style.background = '#30363d'
                    e.currentTarget.style.borderColor = '#484f58'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.background = '#21262d'
                    e.currentTarget.style.borderColor = '#30363d'
                  }}
                >
                  {editData ? 'Enregistrer' : 'Ajouter l\'abonnement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BudgetSection
