import { useState, useEffect } from 'react'
import { settingsAPI } from '../services/api'
import toast from 'react-hot-toast'
import '../styles/modal.css'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenStackTechnique?: () => void
  onUsernameUpdate?: (username: string) => void
}

function ProfileModal({ isOpen, onClose, onOpenStackTechnique, onUsernameUpdate }: ProfileModalProps) {
  const [username, setUsername] = useState('Victor Mirault')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('')

  // Charger le nom d'utilisateur depuis l'API au montage
  useEffect(() => {
    const loadUsername = async () => {
      try {
        const settings = await settingsAPI.getAll()
        const usernameSetting = settings.find(s => s.key === 'username')
        if (usernameSetting) {
          setUsername(usernameSetting.value)
        }
      } catch (error) {
        console.error('Erreur lors du chargement du nom d\'utilisateur:', error)
      }
    }

    if (isOpen) {
      loadUsername()
    }
  }, [isOpen])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setProfilePhoto(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    try {
      // Sauvegarder le nom d'utilisateur dans l'API
      await settingsAPI.save({
        key: 'username',
        value: username,
        type: 'string',
        description: 'Nom d\'utilisateur du profil'
      })

      toast.success('Profil mis à jour avec succès')

      // Notifier le parent du changement de username
      if (onUsernameUpdate) {
        onUsernameUpdate(username)
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      onClose()
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde du profil')
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Mon Profil
          </h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-form">
          {/* Photo de profil */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: profilePhoto
                ? `url("${profilePhoto}") center / cover`
                : 'linear-gradient(135deg, #58a6ff 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(88, 166, 255, 0.3)',
              border: '3px solid #30363d',
              overflow: 'hidden'
            }}>
              {!profilePhoto && (
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" style={{ width: '60px', height: '60px' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
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
                  padding: '8px 16px',
                  background: '#21262d',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  color: '#c9d1d9',
                  fontSize: '13px',
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
                Changer la photo
              </button>
            </div>
          </div>

          {/* Nom d'utilisateur */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#8b949e',
              marginBottom: '6px'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Votre nom d'utilisateur"
              style={{
                width: '100%',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '6px',
                padding: '10px 12px',
                color: '#c9d1d9',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
              onBlur={(e) => e.target.style.borderColor = '#30363d'}
            />
          </div>

          {/* Séparateur */}
          <div style={{
            height: '1px',
            background: '#30363d',
            margin: '24px 0'
          }}></div>

          {/* Changement de mot de passe */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{
              color: '#c9d1d9',
              fontSize: '16px',
              fontWeight: 600,
              margin: 0,
              marginBottom: '8px'
            }}>
              Changer le mot de passe
            </h3>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#8b949e',
                marginBottom: '6px'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Entrez votre mot de passe actuel"
                style={{
                  width: '100%',
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  color: '#c9d1d9',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
                onBlur={(e) => e.target.style.borderColor = '#30363d'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#8b949e',
                marginBottom: '6px'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Entrez un nouveau mot de passe"
                style={{
                  width: '100%',
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  color: '#c9d1d9',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
                onBlur={(e) => e.target.style.borderColor = '#30363d'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#8b949e',
                marginBottom: '6px'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez le nouveau mot de passe"
                style={{
                  width: '100%',
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  color: '#c9d1d9',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#58a6ff'}
                onBlur={(e) => e.target.style.borderColor = '#30363d'}
              />
            </div>

            <p style={{
              fontSize: '12px',
              color: '#6e7681',
              margin: 0
            }}>
              Laissez vide si vous ne voulez pas changer votre mot de passe
            </p>
          </div>
        </form>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => {
              onClose()
              onOpenStackTechnique?.()
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            Stack Technique
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary" onClick={handleSave}>Sauvegarder</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
