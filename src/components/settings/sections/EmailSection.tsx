import { sectionStyles, cardStyles, formStyles, emptyStateStyles, spinnerStyles, colors } from '../settings.styles'
import { EmailTemplates } from '../../../services/api'

interface EmailSectionProps {
  emailTemplates: EmailTemplates
  editingEmailType: string
  onSetEditingType: (type: string) => void
  onUpdateTemplate: (type: string, field: 'subject' | 'body', value: string) => void
  onSaveTemplate: (type: string) => void
}

export function EmailSection({
  emailTemplates,
  editingEmailType,
  onSetEditingType,
  onUpdateTemplate,
  onSaveTemplate
}: EmailSectionProps) {
  const hasTemplates = Object.keys(emailTemplates).length > 0

  return (
    <div>
      {/* Header */}
      <div style={sectionStyles.header}>
        <h3 style={sectionStyles.title}>Templates Email</h3>
        <p style={sectionStyles.description}>
          Personnalisez vos modeles d'emails pour les devis, rapports et factures
        </p>
      </div>

      {/* Content */}
      {!hasTemplates ? (
        <LoadingState />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.entries(emailTemplates).map(([type, template]) => (
            <EmailTemplateCard
              key={type}
              type={type}
              template={template}
              isEditing={editingEmailType === type}
              onEdit={() => onSetEditingType(type)}
              onCancel={() => onSetEditingType('')}
              onSave={() => onSaveTemplate(type)}
              onUpdateField={(field, value) => onUpdateTemplate(type, field, value)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Carte de template
interface EmailTemplateCardProps {
  type: string
  template: { subject: string; body: string }
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  onUpdateField: (field: 'subject' | 'body', value: string) => void
}

function EmailTemplateCard({ type, template, isEditing, onEdit, onCancel, onSave, onUpdateField }: EmailTemplateCardProps) {
  const typeLabels: { [key: string]: string } = {
    devis: 'Devis',
    rapport: 'Rapport',
    facture: 'Facture'
  }

  return (
    <div style={cardStyles.container}>
      {/* Header */}
      <div style={cardStyles.header}>
        <h4 style={{ ...cardStyles.title, textTransform: 'capitalize' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: type === 'devis' ? colors.accent.blue : type === 'rapport' ? colors.accent.green : colors.accent.orange,
            display: 'inline-block',
            marginRight: '8px'
          }} />
          Template {typeLabels[type] || type}
        </h4>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={onCancel} style={{ padding: '8px 16px', fontSize: '13px' }}>
              Annuler
            </button>
            <button className="btn-primary" onClick={onSave} style={{ padding: '8px 16px', fontSize: '13px' }}>
              Sauvegarder
            </button>
          </div>
        ) : (
          <button className="btn-secondary" onClick={onEdit} style={{ padding: '8px 16px', fontSize: '13px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Modifier
          </button>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <EditMode template={template} onUpdateField={onUpdateField} />
      ) : (
        <ViewMode template={template} />
      )}
    </div>
  )
}

// Mode edition
function EditMode({ template, onUpdateField }: { template: { subject: string; body: string }; onUpdateField: (field: 'subject' | 'body', value: string) => void }) {
  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <label style={formStyles.label}>Sujet</label>
        <input
          type="text"
          value={template.subject}
          onChange={(e) => onUpdateField('subject', e.target.value)}
          style={formStyles.input}
        />
      </div>
      <div>
        <label style={formStyles.label}>
          Corps du message
          <span style={{ color: colors.text.dimmed, fontSize: '11px', marginLeft: '8px', fontWeight: 400, textTransform: 'none' }}>
            Variables: {'{clientName}'}, {'{contactPerson}'}, {'{email}'}, {'{projectType}'}, {'{budget}'}, {'{status}'}
          </span>
        </label>
        <textarea
          value={template.body}
          onChange={(e) => onUpdateField('body', e.target.value)}
          rows={10}
          style={formStyles.textarea}
        />
      </div>
    </>
  )
}

// Mode visualisation
function ViewMode({ template }: { template: { subject: string; body: string } }) {
  const displayStyle = {
    padding: '10px 12px',
    background: colors.bg.primary,
    borderRadius: '6px',
    border: `1px solid ${colors.border.secondary}`
  }

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ color: colors.text.muted, fontSize: '13px', marginBottom: '6px', fontWeight: 500 }}>Sujet:</div>
        <div style={{ ...displayStyle, color: colors.text.primary, fontSize: '14px' }}>{template.subject}</div>
      </div>
      <div>
        <div style={{ color: colors.text.muted, fontSize: '13px', marginBottom: '6px', fontWeight: 500 }}>Corps:</div>
        <pre style={{
          ...displayStyle,
          color: colors.text.primary,
          fontSize: '13px',
          fontFamily: "'Courier New', monospace",
          whiteSpace: 'pre-wrap',
          margin: 0,
          lineHeight: '1.5',
          maxHeight: '180px',
          overflowY: 'auto'
        }}>
          {template.body}
        </pre>
      </div>
    </>
  )
}

// Etat de chargement
function LoadingState() {
  return (
    <div style={emptyStateStyles.container}>
      <div style={spinnerStyles.container} />
      <p style={emptyStateStyles.text}>Chargement des templates...</p>
    </div>
  )
}

export default EmailSection
