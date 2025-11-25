import { useState, useEffect, useRef } from 'react'
import { emailTemplatesAPI, EmailTemplates } from '../../services/api'
import { databaseAPI, DatabaseTable } from '../../services/databaseAPI'
import { useDraggable } from './hooks/useDraggable'
import { useLinks, CustomLink } from './hooks/useLinks'
import { ColumnsSection, ColumnConfig } from './sections/ColumnsSection'
import { LinksSection } from './sections/LinksSection'
import { EmailSection } from './sections/EmailSection'
import { DatabaseSection } from './sections/DatabaseSection'
import { colors } from './settings.styles'
import '../../styles/modal.css'

// Types
type ActiveSection = 'columns' | 'links' | 'email' | 'database'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  columns: ColumnConfig[]
  onApplyColumns: (visibleFields: string[]) => void
  customLinks: CustomLink[]
  onApplyLinks: (links: CustomLink[]) => void
}

// Menu items configuration
const getMenuItems = (visibleCount: number, totalCount: number, linksCount: number, tablesCount: number) => [
  {
    id: 'columns' as const,
    label: 'Colonnes',
    icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    count: `${visibleCount}/${totalCount}`,
    color: colors.accent.blue
  },
  {
    id: 'links' as const,
    label: 'Liens rapides',
    icon: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
    count: `${linksCount}`,
    color: colors.accent.purple
  },
  {
    id: 'email' as const,
    label: 'Templates Email',
    icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
    count: '3',
    color: colors.accent.orange
  },
  {
    id: 'database' as const,
    label: 'Base de donnees',
    icon: 'M21 5c0-1.66-4-3-9-3S3 3.34 3 5M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5',
    count: `${tablesCount}`,
    color: colors.accent.green
  }
]

function SettingsModal({
  isOpen,
  onClose,
  columns,
  onApplyColumns,
  customLinks,
  onApplyLinks
}: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>('columns')
  const [columnVisibility, setColumnVisibility] = useState<{ [key: string]: boolean }>({})
  const linksManager = useLinks(customLinks)
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplates>({})
  const [editingEmailType, setEditingEmailType] = useState('')
  const [tables, setTables] = useState<DatabaseTable[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importMessage, setImportMessage] = useState('')
  const { position, isDragging, handleMouseDown, resetPosition } = useDraggable()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      const visibility: { [key: string]: boolean } = {}
      columns.forEach(col => { visibility[col.field] = col.visible })
      setColumnVisibility(visibility)
      linksManager.setLinks(customLinks)
      loadEmailTemplates()
      loadTables()
    }
  }, [isOpen, columns, customLinks])

  const loadTables = async () => {
    try {
      const data = await databaseAPI.getTables()
      setTables(data)
    } catch (error) {
      console.error('Erreur lors du chargement des tables:', error)
    }
  }

  const loadEmailTemplates = async () => {
    try {
      const templates = await emailTemplatesAPI.getAll()
      setEmailTemplates(templates)
    } catch (error) {
      console.error('Erreur lors du chargement des templates email:', error)
    }
  }

  const handleToggleColumn = (field: string) => {
    setColumnVisibility(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSelectAllColumns = () => {
    const allVisible: { [key: string]: boolean } = {}
    columns.forEach(col => { allVisible[col.field] = true })
    setColumnVisibility(allVisible)
  }

  const handleDeselectAllColumns = () => {
    const allHidden: { [key: string]: boolean } = {}
    columns.forEach(col => { allHidden[col.field] = false })
    setColumnVisibility(allHidden)
  }

  const handleUpdateEmailTemplate = (type: string, field: 'subject' | 'body', value: string) => {
    setEmailTemplates(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }))
  }

  const handleSaveEmailTemplate = async () => {
    try {
      await emailTemplatesAPI.save(emailTemplates)
      setEditingEmailType('')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des templates email:', error)
    }
  }

  const handleExportCsv = async (tableName: string) => {
    try { await databaseAPI.exportCsv(tableName) }
    catch (error) { console.error('Erreur export CSV:', error) }
  }

  const handleExportExcel = async (tableName: string) => {
    try { await databaseAPI.exportExcel(tableName) }
    catch (error) { console.error('Erreur export Excel:', error) }
  }

  const handleImportJson = async (file: File) => {
    setIsImporting(true)
    setImportMessage('')
    try {
      const result = await databaseAPI.importJson(file)
      setImportMessage(`Import reussi : ${result.imported.clients} clients, ${result.imported.aiPhotos} images, ${result.imported.prompts} prompts`)
      setTimeout(() => setImportMessage(''), 5000)
    } catch (error: any) {
      setImportMessage(`Erreur : ${error.response?.data?.message || error.message}`)
    } finally {
      setIsImporting(false)
    }
  }

  const handleApply = () => {
    const visibleFields = Object.entries(columnVisibility)
      .filter(([_, visible]) => visible)
      .map(([field]) => field)
    onApplyColumns(visibleFields)
    onApplyLinks(linksManager.links)
    resetPosition()
    onClose()
  }

  if (!isOpen) return null

  const visibleCount = Object.values(columnVisibility).filter(Boolean).length
  const menuItems = getMenuItems(visibleCount, columns.length, linksManager.links.length, tables.length)

  return (
    <div className="modal-overlay" onMouseDown={handleMouseDown}>
      <div
        className="modal-container settings-modal-redesign"
        ref={modalRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          maxWidth: '1100px',
          width: '95%',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          background: colors.bg.primary,
          border: `1px solid ${colors.border.primary}`,
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            background: colors.bg.secondary,
            borderBottom: `1px solid ${colors.border.primary}`,
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.text.muted} strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.text.primary, margin: 0 }}>
              Parametres
            </h2>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              color: colors.text.muted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{
            width: '240px',
            background: colors.bg.primary,
            borderRight: `1px solid ${colors.border.primary}`,
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: activeSection === item.id ? colors.bg.tertiary : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  borderLeft: activeSection === item.id ? `3px solid ${item.color}` : '3px solid transparent',
                  color: activeSection === item.id ? colors.text.primary : colors.text.muted,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeSection === item.id ? 600 : 400,
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.background = colors.bg.secondary
                    e.currentTarget.style.color = colors.text.primary
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = colors.text.muted
                  }
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={activeSection === item.id ? item.color : 'currentColor'} strokeWidth="2">
                  <path d={item.icon} />
                </svg>
                <span style={{ flex: 1 }}>{item.label}</span>
                <span style={{
                  fontSize: '12px',
                  background: activeSection === item.id ? colors.bg.hover : colors.bg.tertiary,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 600
                }}>
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 32px',
            background: colors.bg.primary
          }}>
            {activeSection === 'columns' && (
              <ColumnsSection
                columns={columns}
                columnVisibility={columnVisibility}
                onToggle={handleToggleColumn}
                onSelectAll={handleSelectAllColumns}
                onDeselectAll={handleDeselectAllColumns}
              />
            )}

            {activeSection === 'links' && (
              <LinksSection
                links={linksManager.links}
                editingLinkId={linksManager.editingLinkId}
                formState={linksManager.formState}
                categories={linksManager.getCategories()}
                onUpdateFormField={linksManager.updateFormField}
                onAddOrUpdate={linksManager.handleAddOrUpdateLink}
                onEdit={linksManager.handleEditLink}
                onCancelEdit={linksManager.handleCancelEdit}
                onRemove={linksManager.handleRemoveLink}
              />
            )}

            {activeSection === 'email' && (
              <EmailSection
                emailTemplates={emailTemplates}
                editingEmailType={editingEmailType}
                onSetEditingType={setEditingEmailType}
                onUpdateTemplate={handleUpdateEmailTemplate}
                onSaveTemplate={handleSaveEmailTemplate}
              />
            )}

            {activeSection === 'database' && (
              <DatabaseSection
                tables={tables}
                isExporting={isExporting}
                isImporting={isImporting}
                importMessage={importMessage}
                onExportJson={() => {}}
                onExportCsv={handleExportCsv}
                onExportExcel={handleExportExcel}
                onImportJson={handleImportJson}
                setIsExporting={setIsExporting}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          padding: '16px 24px',
          borderTop: `1px solid ${colors.border.primary}`,
          background: colors.bg.secondary
        }}>
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={handleApply}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Appliquer
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
export type { ColumnConfig, CustomLink }
