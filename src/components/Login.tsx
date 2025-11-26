import { useState, FormEvent } from 'react'
import { authAPI } from '../services/api'
import '../styles/login.css'

interface LoginProps {
  onLogin: (email: string) => void
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.login(email, password)

      // Stocker le token dans localStorage
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
      }

      // Appeler onLogin avec l'email de l'utilisateur
      onLogin(response.user.email)
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Une erreur est survenue lors de la connexion')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
              <polyline points="7.5 19.79 7.5 14.6 3 12"/>
              <polyline points="21 12 16.5 14.6 16.5 19.79"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <h1>Bienvenue sur MiroTrak</h1>
          <p className="subtitle">Connectez-vous pour gérer vos projets</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div style={{
              background: '#f85149',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
              border: '1px solid #da3633'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="victor@mirault.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2024 MiroTrak - Gestion de clients</p>
        </div>
      </div>

      <div className="login-background">
        <div className="background-shape shape-1"></div>
        <div className="background-shape shape-2"></div>
        <div className="background-shape shape-3"></div>
      </div>
    </div>
  )
}

export default Login
