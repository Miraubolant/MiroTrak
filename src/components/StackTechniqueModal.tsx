import { useState, useEffect } from 'react'
import '../styles/modal.css'

interface StackTechniqueModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (stackData: StackData) => void
  initialData?: StackData
}

export interface StackData {
  frontend: string
  backend: string
  database: string
  deployment: string
  versionControl: string
  tools: string
  workflow: string
  notes: string
}

function StackTechniqueModal({ isOpen, onClose, onSave, initialData }: StackTechniqueModalProps) {
  const [formData, setFormData] = useState<StackData>({
    frontend: '',
    backend: '',
    database: '',
    deployment: '',
    versionControl: '',
    tools: '',
    workflow: '',
    notes: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const handleReset = () => {
    setFormData({
      frontend: '',
      backend: '',
      database: '',
      deployment: '',
      versionControl: '',
      tools: '',
      workflow: '',
      notes: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🛠️ Ma Stack Technique</h2>
          <button 
            onClick={onClose}
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="frontend">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                  Frontend
                </label>
                <input
                  type="text"
                  id="frontend"
                  name="frontend"
                  value={formData.frontend}
                  onChange={handleChange}
                  placeholder="Ex: React 18, TypeScript, Vite, TailwindCSS"
                />
              </div>

              <div className="form-group">
                <label htmlFor="backend">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <path d="M6 6h.01M6 18h.01" />
                  </svg>
                  Backend
                </label>
                <input
                  type="text"
                  id="backend"
                  name="backend"
                  value={formData.backend}
                  onChange={handleChange}
                  placeholder="Ex: AdonisJS 6, Node.js 20, Express"
                />
              </div>

              <div className="form-group">
                <label htmlFor="database">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
                    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
                  </svg>
                  Base de données
                </label>
                <input
                  type="text"
                  id="database"
                  name="database"
                  value={formData.database}
                  onChange={handleChange}
                  placeholder="Ex: PostgreSQL 15, Redis, MongoDB"
                />
              </div>

              <div className="form-group">
                <label htmlFor="deployment">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  Déploiement
                </label>
                <input
                  type="text"
                  id="deployment"
                  name="deployment"
                  value={formData.deployment}
                  onChange={handleChange}
                  placeholder="Ex: Vercel, Docker, AWS, Netlify"
                />
              </div>

              <div className="form-group">
                <label htmlFor="versionControl">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="18" r="3" />
                    <circle cx="6" cy="6" r="3" />
                    <path d="M6 9v12M18 9c0-1.66-1.34-3-3-3H9" />
                  </svg>
                  Gestion de version
                </label>
                <input
                  type="text"
                  id="versionControl"
                  name="versionControl"
                  value={formData.versionControl}
                  onChange={handleChange}
                  placeholder="Ex: Git, GitHub, GitFlow"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tools">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  Outils de développement
                </label>
                <input
                  type="text"
                  id="tools"
                  name="tools"
                  value={formData.tools}
                  onChange={handleChange}
                  placeholder="Ex: VS Code, Postman, Figma, Docker Desktop"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="workflow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Workflow de développement
              </label>
              <textarea
                id="workflow"
                name="workflow"
                value={formData.workflow}
                onChange={handleChange}
                placeholder="Décrivez votre processus de développement&#10;Ex:&#10;1. Analyse des besoins et wireframes&#10;2. Setup projet (Vite + React + TypeScript)&#10;3. Développement des composants UI&#10;4. Intégration API backend&#10;5. Tests et validation&#10;6. Déploiement"
                rows={8}
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Notes et bonnes pratiques
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes personnelles, commandes utiles, liens de documentation..."
                rows={6}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={handleReset}>
              Réinitialiser
            </button>
            <div className="modal-footer-right">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                💾 Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StackTechniqueModal
