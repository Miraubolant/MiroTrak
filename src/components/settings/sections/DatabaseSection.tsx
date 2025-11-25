import { useRef } from 'react'
import { sectionStyles, cardStyles, gridStyles, spinnerStyles, iconBoxStyles, colors } from '../settings.styles'
import { DatabaseTable, databaseAPI } from '../../../services/databaseAPI'

interface DatabaseSectionProps {
  tables: DatabaseTable[]
  isExporting: boolean
  isImporting: boolean
  importMessage: string
  onExportJson: () => void
  onExportCsv: (tableName: string) => void
  onExportExcel: (tableName: string) => void
  onImportJson: (file: File) => void
  setIsExporting: (value: boolean) => void
}

export function DatabaseSection({
  tables,
  isExporting,
  isImporting,
  importMessage,
  onExportCsv,
  onExportExcel,
  onImportJson,
  setIsExporting
}: DatabaseSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportJson = async () => {
    setIsExporting(true)
    try {
      await databaseAPI.exportJson()
    } catch (error) {
      console.error('Erreur export JSON:', error)
      alert('Erreur lors de l\'export')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={sectionStyles.header}>
        <h3 style={sectionStyles.title}>Base de donnees</h3>
        <p style={sectionStyles.description}>
          Exportez et importez vos donnees en toute securite
        </p>
      </div>

      {/* Export complet JSON */}
      <div style={{ ...cardStyles.container, marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={iconBoxStyles.container(colors.accent.blue)}>
            <svg width="22" height="22" fill="none" stroke={colors.accent.blue} strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ ...cardStyles.title, marginBottom: '8px' }}>Export complet JSON</h4>
            <p style={{ fontSize: '13px', color: colors.text.muted, margin: '0 0 14px 0', lineHeight: 1.5 }}>
              Telechargez toutes vos donnees dans un seul fichier JSON. Ideal pour les sauvegardes completes.
            </p>
            <button
              onClick={handleExportJson}
              disabled={isExporting}
              className="btn-primary"
              style={{ opacity: isExporting ? 0.6 : 1 }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {isExporting ? 'Export en cours...' : 'Exporter en JSON'}
            </button>
          </div>
        </div>
      </div>

      {/* Export par table */}
      <div style={{ ...cardStyles.container, marginBottom: '16px' }}>
        <h4 style={{ ...cardStyles.title, marginBottom: '16px' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
          Export par table
        </h4>
        <p style={{ fontSize: '13px', color: colors.text.muted, marginBottom: '16px' }}>
          Exportez des tables individuelles en CSV ou Excel
        </p>
        {tables.length === 0 ? (
          <LoadingTables />
        ) : (
          <div style={gridStyles.autoFill('260px')}>
            {tables.map(table => (
              <TableExportItem
                key={table.name}
                table={table}
                onExportCsv={() => onExportCsv(table.name)}
                onExportExcel={() => onExportExcel(table.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Import */}
      <div style={cardStyles.container}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={iconBoxStyles.container(colors.accent.purple)}>
            <svg width="22" height="22" fill="none" stroke={colors.accent.purple} strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ ...cardStyles.title, marginBottom: '8px' }}>Importer des donnees</h4>
            <p style={{ fontSize: '13px', color: colors.text.muted, margin: '0 0 14px 0', lineHeight: 1.5 }}>
              Importez un fichier JSON exporte precedemment.{' '}
              <span style={{ color: colors.accent.red, fontWeight: 500 }}>Attention:</span>{' '}
              les donnees existantes seront remplacees.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  onImportJson(file)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="btn-primary"
              style={{ opacity: isImporting ? 0.6 : 1 }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {isImporting ? 'Import en cours...' : 'Choisir un fichier JSON'}
            </button>

            {importMessage && <ImportMessage message={importMessage} />}
          </div>
        </div>
      </div>
    </div>
  )
}

// Item de table
function TableExportItem({ table, onExportCsv, onExportExcel }: { table: DatabaseTable; onExportCsv: () => void; onExportExcel: () => void }) {
  const buttonStyle = {
    padding: '6px 12px',
    background: 'transparent',
    color: colors.text.muted,
    border: `1px solid ${colors.border.secondary}`,
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    transition: 'all 0.2s ease'
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 14px',
      background: colors.bg.primary,
      border: `1px solid ${colors.border.secondary}`,
      borderRadius: '8px'
    }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: colors.text.primary }}>{table.label}</div>
        <div style={{ fontSize: '12px', color: colors.text.dimmed, marginTop: '2px' }}>
          {table.count} {table.count > 1 ? 'enregistrements' : 'enregistrement'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={onExportCsv}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.bg.tertiary
            e.currentTarget.style.color = colors.text.primary
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = colors.text.muted
          }}
        >CSV</button>
        <button
          onClick={onExportExcel}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.bg.tertiary
            e.currentTarget.style.color = colors.text.primary
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = colors.text.muted
          }}
        >Excel</button>
      </div>
    </div>
  )
}

// Message d'import
function ImportMessage({ message }: { message: string }) {
  const isSuccess = message.toLowerCase().includes('reussi')

  return (
    <div style={{
      marginTop: '14px',
      padding: '12px 14px',
      background: isSuccess ? `${colors.accent.green}15` : `${colors.accent.red}15`,
      border: `1px solid ${isSuccess ? `${colors.accent.green}30` : `${colors.accent.red}30`}`,
      borderRadius: '8px',
      color: isSuccess ? colors.accent.green : colors.accent.red,
      fontSize: '13px',
      lineHeight: 1.5
    }}>
      {isSuccess ? '✓ ' : '✗ '}{message}
    </div>
  )
}

// Loading tables
function LoadingTables() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '32px 20px',
      background: colors.bg.primary,
      border: `1px solid ${colors.border.secondary}`,
      borderRadius: '8px'
    }}>
      <div style={{ ...spinnerStyles.container, width: '32px', height: '32px', margin: '0 auto 12px' }} />
      <p style={{ fontSize: '13px', color: colors.text.muted, margin: 0 }}>Chargement des tables...</p>
    </div>
  )
}

export default DatabaseSection
