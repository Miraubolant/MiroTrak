import { ColDef } from 'ag-grid-community'

// Client name with logo cell renderer
const clientNameRenderer = (params: any) => {
  const clientName = params.value || ''
  const logo = params.data?.logo || '🏢'

  const div = document.createElement('div')
  div.className = 'client-name-cell'

  // Vérifier si c'est la ligne de total
  if (params.node.rowPinned === 'bottom') {
    div.innerHTML = `
      <span class="client-logo">📊</span>
      <span class="client-name-text" style="font-weight: 700;">${clientName}</span>
    `
    return div
  }

  // Vérifier si le logo est une URL (http/https) ou une Data URL (base64)
  const isUrl = logo.startsWith('http://') || logo.startsWith('https://') || logo.startsWith('data:image')

  if (isUrl) {
    div.innerHTML = `
      <span class="client-logo">
        <img src="${logo}" alt="${clientName}" class="client-logo-img" />
      </span>
      <span class="client-name-text">${clientName}</span>
    `
  } else {
    div.innerHTML = `
      <span class="client-logo">${logo}</span>
      <span class="client-name-text">${clientName}</span>
    `
  }

  return div
}

// Actions cell renderer (sans checkbox)
const actionsCellRenderer = (params: any) => {
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
    if (params.context?.onEdit) {
      params.context.onEdit(params.data)
    }
  })

  // Créer le bouton Template
  const templateBtn = document.createElement('button')
  templateBtn.className = 'action-btn template'
  templateBtn.title = 'Générer documents'
  templateBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  `
  templateBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    if (params.context?.onTemplate) {
      params.context.onTemplate(params.data)
    }
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
    if (params.context?.onDelete) {
      params.context.onDelete(params.data)
    }
  })

  // Ajouter les boutons directement au conteneur
  div.appendChild(editBtn)
  div.appendChild(templateBtn)
  div.appendChild(deleteBtn)

  return div
}

// Progress bar cell renderer
const progressBarRenderer = (params: any) => {
  const value = params.value || 0
  const div = document.createElement('div')
  div.className = 'progress-bar-container'
  div.innerHTML = `
    <div class="progress-bar">
      <div class="progress-bar-fill" style="width: ${value}%"></div>
    </div>
    <span class="progress-value">${value}%</span>
  `
  return div
}

// Status cell renderer
const statusCellRenderer = (params: any) => {
  const status = params.value
  const statusClass = status === 'En cours' ? 'status-active' :
                     status === 'Terminé' ? 'status-completed' :
                     status === 'En attente' ? 'status-pending' : 'status-default'

  const div = document.createElement('div')
  div.innerHTML = `<span class="status-badge ${statusClass}">${status}</span>`
  return div
}

// Payment status cell renderer
const paymentStatusRenderer = (params: any) => {
  const status = params.value
  const statusClass = status === 'Payé' ? 'payment-paid' :
                     status === 'Partiel' ? 'payment-partial' :
                     status === 'Impayé' ? 'payment-unpaid' : 'payment-default'

  const div = document.createElement('div')
  div.innerHTML = `<span class="payment-badge ${statusClass}">${status}</span>`
  return div
}

// Priority cell renderer
const priorityRenderer = (params: any) => {
  const priority = params.value
  const priorityClass = priority === 'Haute' ? 'priority-high' :
                       priority === 'Moyenne' ? 'priority-medium' :
                       priority === 'Basse' ? 'priority-low' : 'priority-default'

  const div = document.createElement('div')
  div.innerHTML = `<span class="priority-badge ${priorityClass}">${priority}</span>`
  return div
}

export const columnDefs: ColDef[] = [
  {
    headerName: 'ID',
    field: 'id',
    width: 100,
    editable: false,
  },
  {
    headerName: 'Nom du Client',
    field: 'clientName',
    minWidth: 200,
    cellRenderer: clientNameRenderer,
  },
  {
    headerName: 'Contact',
    field: 'contactPerson',
    minWidth: 150,
  },
  {
    headerName: 'Email',
    field: 'email',
    minWidth: 200,
  },
  {
    headerName: 'Téléphone',
    field: 'phone',
    minWidth: 150,
  },
  {
    headerName: 'Type de Projet',
    field: 'projectType',
    minWidth: 150,
  },
  {
    headerName: 'Statut',
    field: 'status',
    width: 140,
    cellRenderer: statusCellRenderer,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: ['En attente', 'En cours', 'Terminé'],
    },
  },
  {
    headerName: 'Progression',
    field: 'progress',
    width: 180,
    cellRenderer: progressBarRenderer,
    filter: 'agNumberColumnFilter',
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: {
      min: 0,
      max: 100,
    },
  },
  {
    headerName: 'Début',
    field: 'startDate',
    width: 120,
  },
  {
    headerName: 'Échéance',
    field: 'deadline',
    width: 120,
  },
  {
    headerName: 'Budget',
    field: 'budget',
    width: 120,
    valueFormatter: (params) => params.value != null ? `${params.value.toLocaleString()} €` : '0 €',
    filter: 'agNumberColumnFilter',
  },
  {
    headerName: 'Payé',
    field: 'paid',
    width: 120,
    valueFormatter: (params) => params.value != null ? `${params.value.toLocaleString()} €` : '0 €',
    filter: 'agNumberColumnFilter',
  },
  {
    headerName: 'Paiement',
    field: 'paymentStatus',
    width: 130,
    cellRenderer: paymentStatusRenderer,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: ['Impayé', 'Partiel', 'Payé'],
    },
  },
  {
    headerName: 'Priorité',
    field: 'priority',
    width: 120,
    cellRenderer: priorityRenderer,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: ['Basse', 'Moyenne', 'Haute'],
    },
  },
  {
    headerName: 'Technologies',
    field: 'technologies',
    minWidth: 200,
  },
  {
    headerName: 'Dernière MAJ',
    field: 'lastUpdate',
    width: 130,
    editable: false,
  },
  {
    headerName: 'Actions',
    width: 140,
    cellRenderer: actionsCellRenderer,
    suppressHeaderMenuButton: true,
    sortable: false,
    filter: false,
    editable: false,
    pinned: 'right',
  },
]
