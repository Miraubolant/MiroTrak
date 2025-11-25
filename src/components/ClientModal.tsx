import { useState, FormEvent, useRef, useEffect } from 'react'
import '../styles/modal.css'

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (clientData: any) => void
  editData?: any
  focusField?: string
}

function ClientModal({ isOpen, onClose, onSubmit, editData, focusField }: ClientModalProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    logo: '',
    contactPerson: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    startDate: '',
    deadline: '',
    priority: 'Moyenne',
    technologies: '',
    attachments: [] as File[],
    todos: [] as { text: string; completed: boolean }[],
    devPassword: '',
    githubRepo: '',
    supabaseUrl: '',
    supabaseKey: '',
    notes: '',
  })

  const [newTodo, setNewTodo] = useState('')
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false)
  const [logoInput, setLogoInput] = useState('')
  const [objectURLs, setObjectURLs] = useState<string[]>([]) // Pour nettoyer les URLs d'objets

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const modalRef = useRef<HTMLDivElement>(null)
  const focusRef = useRef<{ [key: string]: HTMLInputElement | HTMLSelectElement | null }>({})

  useEffect(() => {
    if (editData) {
      setFormData({ ...editData, attachments: editData.attachments || [] })
    }
  }, [editData])

  useEffect(() => {
    if (isOpen && focusField && focusRef.current[focusField]) {
      setTimeout(() => {
        focusRef.current[focusField]?.focus()
      }, 100)
    }
  }, [isOpen, focusField])

  // Nettoyer les URLs d'objets lors de la fermeture ou du démontage
  useEffect(() => {
    return () => {
      objectURLs.forEach(url => URL.revokeObjectURL(url))
    }
  }, [objectURLs])

  // Nettoyer les URLs et réinitialiser le formulaire lors de la fermeture
  useEffect(() => {
    if (!isOpen) {
      // Révoquer toutes les URLs d'objets créées
      objectURLs.forEach(url => URL.revokeObjectURL(url))
      setObjectURLs([])

      // Réinitialiser le formulaire si ce n'est pas en mode édition
      if (!editData) {
        setFormData({
          clientName: '',
          logo: '',
          contactPerson: '',
          email: '',
          phone: '',
          projectType: '',
          budget: '',
          startDate: '',
          deadline: '',
          priority: 'Moyenne',
          technologies: '',
          attachments: [] as File[],
          todos: [] as { text: string; completed: boolean }[],
          devPassword: '',
          githubRepo: '',
          supabaseUrl: '',
          supabaseKey: '',
          notes: '',
        })
      }
    }
  }, [isOpen])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLogoModalOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, isLogoModalOpen, onClose])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newFiles] }))
    }
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      setFormData(prev => ({
        ...prev,
        todos: [...prev.todos, { text: newTodo, completed: false }]
      }))
      setNewTodo('')
    }
  }

  const toggleTodo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      todos: prev.todos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    }))
  }

  const removeTodo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      todos: prev.todos.filter((_, i) => i !== index)
    }))
  }

  const handleLogoClick = () => {
    setLogoInput(formData.logo)
    setIsLogoModalOpen(true)
  }

  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setLogoInput(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoSave = () => {
    setFormData(prev => ({ ...prev, logo: logoInput }))
    setIsLogoModalOpen(false)
  }

  const handleLogoCancel = () => {
    setLogoInput('')
    setIsLogoModalOpen(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const clientData = {
      id: editData?.id || Date.now(),
      ...formData,
      budget: parseInt(formData.budget),
      paid: editData?.paid || 0,
      status: editData?.status || 'En attente',
      progress: editData?.progress || 0,
      paymentStatus: editData?.paymentStatus || 'Impayé',
      lastUpdate: new Date().toLocaleDateString('fr-FR'),
    }

    onSubmit(clientData)

    // Reset form
    if (!editData) {
      setFormData({
        clientName: '',
        logo: '',
        contactPerson: '',
        email: '',
        phone: '',
        projectType: '',
        budget: '',
        startDate: '',
        deadline: '',
        priority: 'Moyenne',
        technologies: '',
        attachments: [],
        todos: [],
        devPassword: '',
        githubRepo: '',
        supabaseUrl: '',
        supabaseKey: '',
        notes: '',
      })
    }

    setPosition({ x: 0, y: 0 })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div
        ref={modalRef}
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <div className="modal-header" onMouseDown={handleMouseDown}>
          <h2>{editData ? 'Modifier Client' : 'Nouveau Client'}</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                const form = modalRef.current?.querySelector('form')
                if (form) {
                  form.requestSubmit()
                }
              }}
            >
              {editData ? 'Modifier' : 'Créer le Client'}
            </button>
            <button type="button" className="modal-close" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Logo Section - En haut au centre */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <div
              onClick={handleLogoClick}
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: (formData.logo && (formData.logo.startsWith('http') || formData.logo.startsWith('data:image')))
                  ? `url("${formData.logo}") center / cover`
                  : '#21262d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: (formData.logo && !formData.logo.startsWith('http') && !formData.logo.startsWith('data:image')) ? '80px' : '60px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                border: '2px solid #30363d'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.filter = 'brightness(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.filter = 'brightness(1)'
              }}
            >
              {(formData.logo && !formData.logo.startsWith('http') && !formData.logo.startsWith('data:image')) ? formData.logo : (
                !formData.logo && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" style={{ width: '70px', height: '70px' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                )
              )}
              {/* Indicateur de clic */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8,
                transition: 'opacity 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="client-modal-sections">
            {/* Section: Informations générales */}
            <div className="client-section">
              <div className="client-section-header">
                <svg className="client-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <h3 className="client-section-title">Informations générales</h3>
              </div>
              <div className="client-section-content">
                <div className="form-group">
                  <label htmlFor="clientName">Nom du Client *</label>
                  <input
                    ref={(el) => (focusRef.current.clientName = el)}
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                    placeholder="Nom de l'entreprise ou du client"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="contactPerson">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Contact
                    </label>
                    <input
                      ref={(el) => (focusRef.current.contactPerson = el)}
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="Nom du contact principal"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@entreprise.com"
                  />
                </div>
              </div>
            </div>

            {/* Section: Détails du projet */}
            <div className="client-section">
              <div className="client-section-header">
                <svg className="client-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <h3 className="client-section-title">Détails du projet</h3>
              </div>
              <div className="client-section-content">
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="projectType">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                      Type de Projet *
                    </label>
                    <input
                      type="text"
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      placeholder="Site Web, Application Mobile, E-commerce..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      Priorité
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="Basse">🟢 Basse</option>
                      <option value="Moyenne">🟡 Moyenne</option>
                      <option value="Haute">🔴 Haute</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label htmlFor="budget">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      Budget (€)
                    </label>
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="10000"
                      min="0"
                      step="100"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="startDate">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      Date de Début
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="deadline">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      Échéance
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="technologies">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                      <polyline points="16 18 22 12 16 6"/>
                      <polyline points="8 6 2 12 8 18"/>
                    </svg>
                    Technologies
                  </label>
                  <input
                    type="text"
                    id="technologies"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleChange}
                    placeholder="React, TypeScript, Node.js, PostgreSQL..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <line x1="10" y1="9" x2="8" y2="9"/>
                    </svg>
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Informations complémentaires, remarques, besoins spécifiques..."
                    rows={3}
                    style={{
                      width: '100%',
                      background: '#161b22',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      color: '#c9d1d9',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Section: Accès techniques */}
            <div className="client-section">
              <div className="client-section-header">
                <svg className="client-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <h3 className="client-section-title">Accès techniques</h3>
              </div>
              <div className="client-section-content">
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="devPassword">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                      </svg>
                      Mot de passe Dev
                    </label>
                    <input
                      type="password"
                      id="devPassword"
                      name="devPassword"
                      value={formData.devPassword}
                      onChange={handleChange}
                      placeholder="Mot de passe environnement de dev"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="githubRepo">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                      </svg>
                      Dépôt GitHub
                    </label>
                    <input
                      type="url"
                      id="githubRepo"
                      name="githubRepo"
                      value={formData.githubRepo}
                      onChange={handleChange}
                      placeholder="https://github.com/username/repository"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="supabaseUrl">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      </svg>
                      URL Supabase
                    </label>
                    <input
                      type="url"
                      id="supabaseUrl"
                      name="supabaseUrl"
                      value={formData.supabaseUrl}
                      onChange={handleChange}
                      placeholder="https://xxxxx.supabase.co"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="supabaseKey">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                      </svg>
                      Clé API Supabase
                    </label>
                    <input
                      type="password"
                      id="supabaseKey"
                      name="supabaseKey"
                      value={formData.supabaseKey}
                      onChange={handleChange}
                      placeholder="Clé anon publique Supabase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Pièces jointes */}
            <div className="client-section">
              <div className="client-section-header">
                <svg className="client-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                <h3 className="client-section-title">Pièces jointes</h3>
              </div>
              <div className="client-section-content">
                <div className="form-group">
                  <label htmlFor="attachments">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                      <polyline points="13 2 13 9 20 9"/>
                    </svg>
                    Ajouter des fichiers
                  </label>
                  <div style={{
                    position: 'relative',
                    marginTop: '8px'
                  }}>
                    <input
                      type="file"
                      id="attachments"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      style={{
                        position: 'absolute',
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                        zIndex: 2
                      }}
                    />
                    <div style={{
                      padding: '24px',
                      border: '2px dashed #30363d',
                      borderRadius: '8px',
                      background: '#0d1117',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      ':hover': {
                        borderColor: '#8b949e',
                        background: '#161b22'
                      }
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" style={{ width: '40px', height: '40px', margin: '0 auto 12px' }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <p style={{ color: '#c9d1d9', fontSize: '14px', marginBottom: '4px' }}>
                        Cliquez ou glissez des fichiers ici
                      </p>
                      <p style={{ color: '#8b949e', fontSize: '12px' }}>
                        Images, PDF, documents (max 10 Mo par fichier)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Liste des fichiers attachés avec prévisualisation */}
                {formData.attachments.length > 0 && (
                  <div style={{
                    marginTop: '20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '12px'
                  }}>
                    {formData.attachments.map((file, index) => (
                      <div key={index} style={{
                        position: 'relative',
                        border: '1px solid #30363d',
                        borderRadius: '8px',
                        padding: '8px',
                        background: '#161b22',
                        transition: 'all 0.2s'
                      }}>
                        {/* Bouton de suppression */}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: '#f85149',
                            border: 'none',
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 1,
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#da3633'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#f85149'
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>

                        {/* Prévisualisation */}
                        <div style={{
                          width: '100%',
                          height: '100px',
                          borderRadius: '6px',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#0d1117',
                          overflow: 'hidden'
                        }}>
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : file.type === 'application/pdf' ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#f85149" strokeWidth="2" style={{ width: '48px', height: '48px' }}>
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                              <path d="M10 12h4"/>
                              <path d="M10 16h4"/>
                            </svg>
                          ) : file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx') ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" style={{ width: '48px', height: '48px' }}>
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                              <line x1="16" y1="13" x2="8" y2="13"/>
                              <line x1="16" y1="17" x2="8" y2="17"/>
                              <polyline points="10 9 9 9 8 9"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" style={{ width: '48px', height: '48px' }}>
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                              <polyline points="13 2 13 9 20 9"/>
                            </svg>
                          )}
                        </div>

                        {/* Nom du fichier */}
                        <p style={{
                          fontSize: '11px',
                          color: '#c9d1d9',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }} title={file.name}>
                          {file.name}
                        </p>

                        {/* Taille du fichier */}
                        <p style={{
                          fontSize: '10px',
                          color: '#8b949e'
                        }}>
                          {(file.size / 1024).toFixed(1)} Ko
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Modale pour modifier le logo */}
      {isLogoModalOpen && (
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
        }} onClick={handleLogoCancel}>
          <div style={{
            background: '#161b22',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            border: '1px solid #30363d',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                color: '#c9d1d9',
                fontSize: '18px',
                fontWeight: 600,
                margin: 0
              }}>
                Modifier le logo
              </h3>
              <button
                type="button"
                onClick={handleLogoCancel}
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
                <svg viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#8b949e',
                fontSize: '13px',
                marginBottom: '8px',
                fontWeight: 500
              }}>
                URL de l'image ou emoji
              </label>
              <input
                type="text"
                value={logoInput}
                onChange={(e) => setLogoInput(e.target.value)}
                placeholder="https://example.com/logo.png ou 🏢"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  color: '#c9d1d9',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogoSave()
                  } else if (e.key === 'Escape') {
                    handleLogoCancel()
                  }
                }}
              />
              <p style={{
                fontSize: '12px',
                color: '#6e7681',
                marginTop: '8px',
                lineHeight: '1.4'
              }}>
                Vous pouvez utiliser un emoji (ex: 🏢, 💼, 🚀) ou une URL d'image
              </p>

              {/* Séparateur OU */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '16px 0',
                gap: '12px'
              }}>
                <div style={{ flex: 1, height: '1px', background: '#30363d' }}></div>
                <span style={{ color: '#6e7681', fontSize: '12px', fontWeight: 500 }}>OU</span>
                <div style={{ flex: 1, height: '1px', background: '#30363d' }}></div>
              </div>

              {/* Bouton sélection de fichier */}
              <div style={{ position: 'relative' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileSelect}
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                />
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#21262d',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#30363d'
                    e.currentTarget.style.borderColor = '#8b949e'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#21262d'
                    e.currentTarget.style.borderColor = '#30363d'
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  Sélectionner une image depuis l'ordinateur
                </button>
              </div>
            </div>

            {/* Prévisualisation */}
            {logoInput && (
              <div style={{
                marginBottom: '20px',
                padding: '16px',
                background: '#0d1117',
                borderRadius: '8px',
                border: '1px solid #30363d'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#8b949e',
                  marginBottom: '12px',
                  fontWeight: 500
                }}>
                  Prévisualisation
                </p>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '12px',
                  background: (logoInput.startsWith('http') || logoInput.startsWith('data:image'))
                    ? `url("${logoInput}") center / cover`
                    : '#21262d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: (logoInput && !logoInput.startsWith('http') && !logoInput.startsWith('data:image')) ? '60px' : '40px',
                  border: '2px solid #30363d',
                  margin: '0 auto'
                }}>
                  {(logoInput && !logoInput.startsWith('http') && !logoInput.startsWith('data:image')) ? logoInput : null}
                </div>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={handleLogoCancel}
                style={{
                  padding: '10px 20px',
                  background: '#30363d',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#c9d1d9',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#484f58'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#30363d'
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleLogoSave}
                style={{
                  padding: '10px 20px',
                  background: '#238636',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(88, 166, 255, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientModal
