import { useState, useEffect } from 'react'
import { aiPhotosAPI, promptsAPI } from '../services/api'
import { AiPhoto, Prompt } from '../types'

interface RecentActivityProps {
  onOpenAiImage: (photo: AiPhoto) => void
  onOpenPrompt: (prompt: Prompt) => void
  refreshTrigger?: number
}

function RecentActivity({ onOpenAiImage, onOpenPrompt, refreshTrigger }: RecentActivityProps) {
  const [recentPhotos, setRecentPhotos] = useState<AiPhoto[]>([])
  const [recentPrompts, setRecentPrompts] = useState<Prompt[]>([])
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true)
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set())
  const [isMobile, setIsMobile] = useState(false)

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    loadRecentPhotos()
    loadRecentPrompts()
  }, [isMobile])

  // Rafraîchir quand refreshTrigger change
  useEffect(() => {
    if (refreshTrigger) {
      loadRecentPhotos()
      loadRecentPrompts()
    }
  }, [refreshTrigger])

  const loadRecentPhotos = async () => {
    try {
      setIsLoadingPhotos(true)
      const photos = await aiPhotosAPI.getAll()
      // Limiter à 10 images sur mobile, afficher toutes sur desktop
      const photosToShow = isMobile ? photos.slice(0, 10) : photos
      setRecentPhotos(photosToShow)
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error)
    } finally {
      setIsLoadingPhotos(false)
    }
  }

  const loadRecentPrompts = async () => {
    try {
      setIsLoadingPrompts(true)
      const prompts = await promptsAPI.getAll()
      // Afficher seulement les 5 derniers prompts
      setRecentPrompts(prompts.slice(0, 5))
    } catch (error) {
      console.error('Erreur lors du chargement des prompts:', error)
    } finally {
      setIsLoadingPrompts(false)
    }
  }

  return (
    <div className="recent-activity-grid" style={{
      marginBottom: '32px',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
      height: '100%'
    }}>
      {/* Section Images IA */}
      <div style={{
        background: 'linear-gradient(135deg, #161b22 0%, #1c2128 100%)',
        border: '1px solid #30363d',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#e6edf3',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              Dernières Images IA
            </h3>
            <span style={{
              fontSize: '12px',
              color: '#8b949e',
              background: '#21262d',
              padding: '4px 10px',
              borderRadius: '12px',
              border: '1px solid #30363d'
            }}>
              {recentPhotos.length} images
            </span>
          </div>

          {isLoadingPhotos ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px 0'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #30363d',
                borderTop: '3px solid #58a6ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          ) : recentPhotos.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#8b949e'
            }}>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Aucune image disponible
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '12px',
              overflowY: 'auto',
              flex: 1,
              paddingRight: '4px'
            }}>
              {recentPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => onOpenAiImage(photo)}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '2px solid #30363d',
                    transition: 'all 0.2s',
                    background: '#21262d'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#58a6ff'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(88, 166, 255, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#30363d'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {photo.id !== undefined && !imagesLoaded.has(photo.id) && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '24px',
                      height: '24px',
                      border: '3px solid #30363d',
                      borderTop: '3px solid #58a6ff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}
                  <img
                    src={photo.imageUrl}
                    alt={photo.name}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => photo.id !== undefined && setImagesLoaded(prev => new Set(prev).add(photo.id!))}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: photo.id !== undefined && imagesLoaded.has(photo.id) ? 1 : 0,
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(13, 17, 23, 0.9), transparent)',
                    padding: '20px 8px 6px',
                    fontSize: '11px',
                    color: '#e6edf3',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {photo.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Section Prompts */}
      <div style={{
        background: 'linear-gradient(135deg, #161b22 0%, #1c2128 100%)',
        border: '1px solid #30363d',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#e6edf3',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Derniers Prompts
            </h3>
            <span style={{
              fontSize: '12px',
              color: '#8b949e',
              background: '#21262d',
              padding: '4px 10px',
              borderRadius: '12px',
              border: '1px solid #30363d'
            }}>
              {recentPrompts.length} prompts
            </span>
          </div>

          {isLoadingPrompts ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px 0'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #30363d',
                borderTop: '3px solid #58a6ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          ) : recentPrompts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#8b949e'
            }}>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Aucun prompt disponible
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              overflowY: 'auto',
              flex: 1,
              paddingRight: '4px'
            }}>
              {recentPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  onClick={() => onOpenPrompt(prompt)}
                  style={{
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#58a6ff'
                    e.currentTarget.style.background = '#161b22'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#30363d'
                    e.currentTarget.style.background = '#0d1117'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '6px'
                  }}>
                    <h4 style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#e6edf3',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}>
                      {prompt.title}
                    </h4>
                    {prompt.category && (
                      <span style={{
                        fontSize: '10px',
                        color: '#8b949e',
                        background: '#21262d',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        marginLeft: '8px',
                        flexShrink: 0
                      }}>
                        {prompt.category}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: '12px',
                    color: '#8b949e',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4'
                  }}>
                    {prompt.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  )
}

export default RecentActivity
