import { useState, useEffect } from 'react'
import '../styles/sidebar.css'

interface CustomLink {
  id: string
  name: string
  url: string
  icon: string
  category?: string
}

interface SidebarProps {
  customLinks: CustomLink[]
  onToggle?: (collapsed: boolean) => void
  onOpenPromptsLibrary?: () => void
  onOpenAiImagesLibrary?: () => void
}

function Sidebar({ customLinks, onToggle, onOpenPromptsLibrary, onOpenAiImagesLibrary }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('sidebar-expanded-categories')
    return saved ? new Set(JSON.parse(saved)) : new Set()
  })
  const [maxCollapsedLinks, setMaxCollapsedLinks] = useState(8)

  // Calculer dynamiquement le nombre maximum d'icônes en mode réduit
  useEffect(() => {
    const calculateMaxLinks = () => {
      // Hauteur de la fenêtre - header (57px) - footer (environ 120px) - padding (24px)
      const availableHeight = window.innerHeight - 57 - 120 - 24
      // Chaque lien fait environ 48px (padding + icon + margin)
      const linkHeight = 48
      const maxLinks = Math.floor(availableHeight / linkHeight)
      // Minimum 4, maximum 12
      setMaxCollapsedLinks(Math.max(4, Math.min(maxLinks, 12)))
    }

    calculateMaxLinks()
    window.addEventListener('resize', calculateMaxLinks)
    return () => window.removeEventListener('resize', calculateMaxLinks)
  }, [])

  const handleToggle = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    onToggle?.(newState)
  }

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      localStorage.setItem('sidebar-expanded-categories', JSON.stringify([...newSet]))
      return newSet
    })
  }

  // Grouper les liens par catégorie
  const linksByCategory = customLinks.reduce((acc, link) => {
    const category = link.category || 'Général'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(link)
    return acc
  }, {} as Record<string, CustomLink[]>)

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={handleToggle}
        title={isCollapsed ? 'Ouvrir le menu' : 'Fermer le menu'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isCollapsed ? (
            <path d="M9 18l6-6-6-6"/>
          ) : (
            <path d="M15 18l-6-6 6-6"/>
          )}
        </svg>
      </button>

      <div className="sidebar-content">
        <div className="sidebar-brand">
          <svg className="sidebar-brand-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
            <polyline points="7.5 19.79 7.5 14.6 3 12"/>
            <polyline points="21 12 16.5 14.6 16.5 19.79"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
          {!isCollapsed && <span className="sidebar-brand-text">MiroTrak</span>}
        </div>

        <nav className="sidebar-nav">
          {customLinks.length > 0 ? (
            Object.entries(linksByCategory).map(([category, links]) => (
              <div key={category} className="sidebar-category">
                {!isCollapsed && (
                  <button
                    className="sidebar-category-header"
                    onClick={() => toggleCategory(category)}
                  >
                    <svg
                      className={`sidebar-category-icon ${expandedCategories.has(category) ? 'expanded' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                    <span className="sidebar-category-name">{category}</span>
                    <span className="sidebar-category-count">{links.length}</span>
                  </button>
                )}
                {(isCollapsed || expandedCategories.has(category)) && (
                  <div className="sidebar-category-links">
                    {links.slice(0, isCollapsed ? maxCollapsedLinks : undefined).map(link => {
                      const isIconUrl = link.icon.startsWith('http://') || link.icon.startsWith('https://')
                      return (
                        <button
                          key={link.id}
                          className="sidebar-link"
                          onClick={() => handleLinkClick(link.url)}
                          title={isCollapsed ? link.name : ''}
                        >
                          <span className="sidebar-link-icon">
                            {isIconUrl ? (
                              <img src={link.icon} alt={link.name} className="sidebar-link-icon-img" />
                            ) : (
                              link.icon
                            )}
                          </span>
                          {!isCollapsed && <span className="sidebar-link-text">{link.name}</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))
          ) : (
            !isCollapsed && (
              <div className="sidebar-empty">
                <p>Aucun lien</p>
                <span>Configurez vos liens dans les paramètres</span>
              </div>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-settings-btn"
            onClick={onOpenPromptsLibrary}
            title={isCollapsed ? 'Bibliothèque Prompts' : ''}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            {!isCollapsed && <span>Prompts</span>}
          </button>
          
          <button
            className="sidebar-settings-btn"
            onClick={onOpenAiImagesLibrary}
            title={isCollapsed ? 'Bibliothèque Images IA' : ''}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            {!isCollapsed && <span>Images IA</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
