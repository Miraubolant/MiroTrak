import { sectionStyles, gridStyles, infoBoxStyles, colors } from '../settings.styles'

export interface ColumnConfig {
  field: string
  headerName: string
  visible: boolean
}

interface ColumnsSectionProps {
  columns: ColumnConfig[]
  columnVisibility: { [key: string]: boolean }
  onToggle: (field: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function ColumnsSection({
  columns,
  columnVisibility,
  onToggle,
  onSelectAll,
  onDeselectAll
}: ColumnsSectionProps) {
  const visibleCount = Object.values(columnVisibility).filter(Boolean).length
  const totalCount = columns.length

  return (
    <div>
      {/* Header */}
      <div style={sectionStyles.header}>
        <h3 style={sectionStyles.title}>Gestion des colonnes</h3>
        <p style={sectionStyles.description}>
          Selectionnez les colonnes a afficher dans la grille de donnees
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button className="btn-secondary" onClick={onSelectAll}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Tout selectionner
        </button>
        <button className="btn-secondary" onClick={onDeselectAll}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          </svg>
          Tout deselectionner
        </button>
      </div>

      {/* Column Grid */}
      <div style={gridStyles.autoFill('260px')}>
        {columns.map(col => (
          <ColumnItem
            key={col.field}
            column={col}
            isVisible={columnVisibility[col.field] || false}
            onToggle={() => onToggle(col.field)}
          />
        ))}
      </div>

      {/* Info Box */}
      <div style={infoBoxStyles.container}>
        <svg viewBox="0 0 24 24" fill="none" stroke={colors.accent.blue} strokeWidth="2" style={{ width: '20px', height: '20px', flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <div>
          <div style={infoBoxStyles.title}>
            {visibleCount} colonnes selectionnees sur {totalCount}
          </div>
          <div style={infoBoxStyles.subtitle}>
            Les modifications seront appliquees a la grille
          </div>
        </div>
      </div>
    </div>
  )
}

// Sous-composant pour chaque colonne
interface ColumnItemProps {
  column: ColumnConfig
  isVisible: boolean
  onToggle: () => void
}

function ColumnItem({ column, isVisible, onToggle }: ColumnItemProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        background: isVisible ? colors.bg.tertiary : colors.bg.secondary,
        border: `1px solid ${isVisible ? colors.accent.blue : colors.border.secondary}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (!isVisible) {
          e.currentTarget.style.borderColor = colors.border.hover
          e.currentTarget.style.background = colors.bg.tertiary
        }
      }}
      onMouseLeave={(e) => {
        if (!isVisible) {
          e.currentTarget.style.borderColor = colors.border.secondary
          e.currentTarget.style.background = colors.bg.secondary
        }
      }}
    >
      {/* Custom Checkbox */}
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '4px',
        border: `2px solid ${isVisible ? colors.accent.blue : colors.border.secondary}`,
        background: isVisible ? colors.accent.blue : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        flexShrink: 0
      }}>
        {isVisible && (
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" style={{ width: '12px', height: '12px' }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </div>
      <input
        type="checkbox"
        checked={isVisible}
        onChange={onToggle}
        style={{ display: 'none' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 500,
          color: colors.text.primary,
          marginBottom: '2px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {column.headerName}
        </div>
        <div style={{
          fontSize: '11px',
          color: colors.text.dimmed,
          fontFamily: "'Courier New', monospace"
        }}>
          {column.field}
        </div>
      </div>
    </label>
  )
}

export default ColumnsSection
