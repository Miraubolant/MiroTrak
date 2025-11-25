import { useState, useRef, useEffect } from 'react'
import { aiPhotosAPI } from '../services/api'
import { AiPhoto } from '../types'
import AiImageModal from './AiImageModal'
import DeleteConfirmModal from './DeleteConfirmModal'

interface AiImagesLibraryProps {
  onUploadComplete?: () => void
}

function AiImagesLibrary({ onUploadComplete }: AiImagesLibraryProps) {
  const [photos, setPhotos] = useState<AiPhoto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<AiPhoto | undefined>()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const bulkFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    try {
      setIsLoading(true)
      const data = await aiPhotosAPI.getAll()
      setPhotos(data)
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePhoto = async (photoData: Omit<AiPhoto, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await aiPhotosAPI.create(photoData)
      await loadPhotos()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Erreur lors de la création de la photo:', error)
    }
  }

  const handleUpdatePhoto = async (photoData: Omit<AiPhoto, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedPhoto?.id) {
        await aiPhotosAPI.update(selectedPhoto.id, photoData)
        await loadPhotos()
        setIsModalOpen(false)
        setSelectedPhoto(undefined)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo:', error)
    }
  }

  const handleDeleteSelected = async () => {
    try {
      const idsToDelete = Array.from(selectedPhotos)
      await aiPhotosAPI.deleteBulk(idsToDelete)
      await loadPhotos()
      setSelectedPhotos(new Set())
      setIsSelectionMode(false)
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error('Erreur lors de la suppression des photos:', error)
    }
  }

  const handleViewPhoto = (photo: AiPhoto) => {
    if (isSelectionMode) {
      togglePhotoSelection(photo.id!)
    } else {
      setSelectedPhoto(photo)
      setIsViewModalOpen(true)
    }
  }

  const handleEditPhoto = (photo: AiPhoto) => {
    setSelectedPhoto(photo)
    setIsModalOpen(true)
  }

  const togglePhotoSelection = (photoId: number) => {
    setSelectedPhotos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(photoId)) {
        newSet.delete(photoId)
      } else {
        newSet.add(photoId)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set())
    } else {
      setSelectedPhotos(new Set(photos.map(p => p.id!)))
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        const fileName = file.name.replace(/\.[^/.]+$/, '')
        setSelectedPhoto({
          name: fileName,
          imageUrl: imageUrl,
          imagePrompt: '',
          videoPrompt: ''
        })
        setIsModalOpen(true)
      }
      reader.readAsDataURL(file)
    }
    event.target.value = ''
  }

  const handleBulkFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setIsUploading(true)
      setUploadProgress(0)
      
      const photosToCreate: Omit<AiPhoto, 'id' | 'createdAt' | 'updatedAt'>[] = []
      const totalFiles = files.length
      
      // Lecture des fichiers
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        
        await new Promise<void>((resolve) => {
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string
            const fileName = file.name.replace(/\.[^/.]+$/, '')
            photosToCreate.push({
              name: fileName,
              imageUrl: imageUrl,
              imagePrompt: '',
              videoPrompt: ''
            })
            
            // Mise à jour de la progression (30% pour la lecture des fichiers)
            setUploadProgress(Math.round(((i + 1) / totalFiles) * 30))
            resolve()
          }
          reader.readAsDataURL(file)
        })
      }

      try {
        // Upload par lots de 5 images pour éviter le 413
        const batchSize = 5
        const totalBatches = Math.ceil(photosToCreate.length / batchSize)
        
        for (let i = 0; i < photosToCreate.length; i += batchSize) {
          const batch = photosToCreate.slice(i, i + batchSize)
          await aiPhotosAPI.createBulk(batch)
          
          // Mise à jour de la progression (30% à 100% pour l'upload)
          const currentBatch = Math.floor(i / batchSize) + 1
          setUploadProgress(30 + Math.round((currentBatch / totalBatches) * 70))
        }
        
        setUploadProgress(100)
        await loadPhotos()
        
        // Notifier le Dashboard pour rafraîchir l'activité récente
        if (onUploadComplete) {
          onUploadComplete()
        }
        
        // Attendre un peu avant de cacher la barre
        setTimeout(() => {
          setIsUploading(false)
          setUploadProgress(0)
        }, 1000)
      } catch (error) {
        console.error('Erreur lors de l\'upload en masse:', error)
        setIsUploading(false)
        setUploadProgress(0)
      }
    }
    event.target.value = ''
  }

  return (
    <div style={{
      padding: '24px',
      minHeight: '100vh',
      background: '#0d1117'
    }}>
      {/* Modal de progression */}
      {isUploading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '12px',
            padding: '32px',
            minWidth: '400px',
            maxWidth: '500px'
          }}>
            <h3 style={{
              color: '#e6edf3',
              fontSize: '18px',
              fontWeight: 600,
              margin: '0 0 20px 0',
              textAlign: 'center'
            }}>
              Upload en cours...
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#8b949e', fontSize: '14px' }}>
                Progression
              </span>
              <span style={{ color: '#e6edf3', fontSize: '14px', fontWeight: 600 }}>
                {uploadProgress}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              background: '#21262d',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid #30363d'
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                height: '100%',
                background: '#8b949e',
                transition: 'width 0.3s ease',
                borderRadius: '6px'
              }} />
            </div>
            <p style={{
              color: '#8b949e',
              fontSize: '13px',
              margin: '16px 0 0 0',
              textAlign: 'center'
            }}>
              Veuillez patienter pendant l'importation des images...
            </p>
          </div>
        </div>
      )}

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
            Bibliothèque d'Images IA
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#8b949e',
            margin: 0
          }}>
            {photos.length} image{photos.length > 1 ? 's' : ''} disponible{photos.length > 1 ? 's' : ''}
            {selectedPhotos.size > 0 && ` • ${selectedPhotos.size} sélectionnée${selectedPhotos.size > 1 ? 's' : ''}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {isSelectionMode ? (
            <>
              <button
                onClick={toggleSelectAll}
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
                {selectedPhotos.size === photos.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={selectedPhotos.size === 0}
                style={{
                  background: selectedPhotos.size === 0 ? '#21262d' : '#da3633',
                  border: `1px solid ${selectedPhotos.size === 0 ? '#30363d' : '#da3633'}`,
                  borderRadius: '6px',
                  padding: '10px 20px',
                  color: selectedPhotos.size === 0 ? '#8b949e' : '#ffffff',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: selectedPhotos.size === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedPhotos.size > 0) e.currentTarget.style.background = '#c93734'
                }}
                onMouseLeave={(e) => {
                  if (selectedPhotos.size > 0) e.currentTarget.style.background = '#da3633'
                }}
              >
                Supprimer ({selectedPhotos.size})
              </button>
              <button
                onClick={() => {
                  setIsSelectionMode(false)
                  setSelectedPhotos(new Set())
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
                onMouseEnter={(e) => e.currentTarget.style.background = '#30363d'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#21262d'}
              >
                Annuler
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsSelectionMode(true)}
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
                Sélection multiple
              </button>
              <button
                onClick={() => bulkFileInputRef.current?.click()}
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
                Upload en masse
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
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
                + Ajouter une photo
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <input
        ref={bulkFileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleBulkFileUpload}
        style={{ display: 'none' }}
      />

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
      ) : photos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: '#8b949e'
        }}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>
            Aucune image disponible
          </p>
          <p style={{ fontSize: '14px' }}>
            Commencez par ajouter votre première image IA
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '16px',
          maxWidth: '100%'
        }}>
          {photos.map((photo) => (
            <div
              key={photo.id}
              style={{
                background: 'linear-gradient(135deg, #161b22 0%, #1c2128 100%)',
                border: `2px solid ${selectedPhotos.has(photo.id!) ? '#58a6ff' : '#30363d'}`,
                borderRadius: '12px',
                padding: '12px',
                transition: 'all 0.2s',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => handleViewPhoto(photo)}
              onMouseEnter={(e) => {
                if (!selectedPhotos.has(photo.id!)) {
                  e.currentTarget.style.borderColor = '#58a6ff'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(88, 166, 255, 0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedPhotos.has(photo.id!)) {
                  e.currentTarget.style.borderColor = '#30363d'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {/* Checkbox for selection mode */}
              {isSelectionMode && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  zIndex: 10
                }}>
                  <input
                    type="checkbox"
                    checked={selectedPhotos.has(photo.id!)}
                    onChange={(e) => {
                      e.stopPropagation()
                      togglePhotoSelection(photo.id!)
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              )}

              {/* Image */}
              <div style={{
                width: '100%',
                height: '350px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#0d1117',
                marginBottom: '12px'
              }}>
                <img
                  src={photo.imageUrl}
                  alt={photo.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#e6edf3',
                  margin: '0 0 8px 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {photo.name}
                </h3>
                
                {/* Aperçu des prompts */}
                {photo.imagePrompt && (
                  <div style={{
                    marginBottom: '8px',
                    padding: '8px',
                    background: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '6px'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#58a6ff',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Prompt Image
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#8b949e',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.4'
                    }}>
                      {photo.imagePrompt}
                    </div>
                  </div>
                )}
                
                {photo.videoPrompt && (
                  <div style={{
                    marginBottom: '8px',
                    padding: '8px',
                    background: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '6px'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#a371f7',
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Prompt Vidéo
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#8b949e',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.4'
                    }}>
                      {photo.videoPrompt}
                    </div>
                  </div>
                )}
                
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#8b949e'
                }}>
                  {photo.imagePrompt && (
                    <span style={{
                      padding: '2px 8px',
                      background: '#21262d',
                      border: '1px solid #30363d',
                      borderRadius: '4px'
                    }}>
                      Image
                    </span>
                  )}
                  {photo.videoPrompt && (
                    <span style={{
                      padding: '2px 8px',
                      background: '#21262d',
                      border: '1px solid #30363d',
                      borderRadius: '4px'
                    }}>
                      Vidéo
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {!isSelectionMode && (
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  borderTop: '1px solid #21262d',
                  paddingTop: '12px'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditPhoto(photo)
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AiImageModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPhoto(undefined)
        }}
        onSubmit={selectedPhoto?.id ? handleUpdatePhoto : handleCreatePhoto}
        editData={selectedPhoto}
      />

      <AiImageModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedPhoto(undefined)
        }}
        editData={selectedPhoto}
        viewOnly
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSelected}
        itemName={`${selectedPhotos.size} image${selectedPhotos.size > 1 ? 's' : ''}`}
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

export default AiImagesLibrary
