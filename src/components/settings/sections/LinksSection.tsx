import { sectionStyles, cardStyles, formStyles, gridStyles, emptyStateStyles, colors } from '../settings.styles'
import { CustomLink } from '../hooks/useLinks'

interface LinksSectionProps {
  links: CustomLink[]
  editingLinkId: string | null
  formState: { name: string; url: string; icon: string; category: string }
  categories: string[]
  onUpdateFormField: (field: 'name' | 'url' | 'icon' | 'category', value: string) => void
  onAddOrUpdate: () => void
  onEdit: (link: CustomLink) => void
  onCancelEdit: () => void
  onRemove: (id: string) => void
}

export function LinksSection({
  links,
  editingLinkId,
  formState,
  categories,
  onUpdateFormField,
  onAddOrUpdate,
  onEdit,
  onCancelEdit,
  onRemove
}: LinksSectionProps) {
  return (
    <div>
      {/* Header */}
      <div style={sectionStyles.header}>
        <h3 style={sectionStyles.title}>Liens rapides</h3>
        <p style={sectionStyles.description}>
          Gerez vos raccourcis vers vos outils et ressources preferes
        </p>
      </div>

      {/* Form */}
      <div style={{ ...cardStyles.container, marginBottom: '24px' }}>
        <h4 style={{ ...cardStyles.title, marginBottom: '16px' }}>
          {editingLinkId ? 'Modifier le lien' : 'Ajouter un nouveau lien'}
        </h4>

        {/* Row 1: Icon + Name */}
        <div style={formStyles.grid('80px 1fr')}>
          <div>
            <label style={formStyles.label}>Icone</label>
            <input
              type="text"
              placeholder="🔗"
              value={formState.icon}
              onChange={(e) => onUpdateFormField('icon', e.target.value)}
              style={{ ...formStyles.input, textAlign: 'center', fontSize: '18px' }}
            />
          </div>
          <div>
            <label style={formStyles.label}>Nom du lien</label>
            <input
              type="text"
              placeholder="GitHub"
              value={formState.name}
              onChange={(e) => onUpdateFormField('name', e.target.value)}
              style={formStyles.input}
            />
          </div>
        </div>

        {/* Row 2: Category + URL */}
        <div style={formStyles.grid('180px 1fr')}>
          <div>
            <label style={formStyles.label}>Categorie</label>
            <input
              type="text"
              placeholder="General"
              value={formState.category}
              onChange={(e) => onUpdateFormField('category', e.target.value)}
              list="categories"
              style={formStyles.input}
            />
            <datalist id="categories">
              {categories.map(cat => <option key={cat} value={cat} />)}
            </datalist>
          </div>
          <div>
            <label style={formStyles.label}>URL</label>
            <input
              type="url"
              placeholder="https://exemple.com"
              value={formState.url}
              onChange={(e) => onUpdateFormField('url', e.target.value)}
              style={formStyles.input}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {editingLinkId && (
            <button className="btn-secondary" onClick={onCancelEdit}>Annuler</button>
          )}
          <button className="btn-primary" onClick={onAddOrUpdate}>
            {editingLinkId ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>

      {/* Links List */}
      {links.length > 0 ? (
        <div style={gridStyles.autoFill('300px')}>
          {links.map(link => (
            <LinkItem
              key={link.id}
              link={link}
              isEditing={editingLinkId === link.id}
              onEdit={() => onEdit(link)}
              onRemove={() => onRemove(link.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyLinksState />
      )}
    </div>
  )
}

// Item de lien
interface LinkItemProps {
  link: CustomLink
  isEditing: boolean
  onEdit: () => void
  onRemove: () => void
}

function LinkItem({ link, isEditing, onEdit, onRemove }: LinkItemProps) {
  const isIconUrl = link.icon.startsWith('http://') || link.icon.startsWith('https://')

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 16px',
      background: isEditing ? colors.bg.tertiary : colors.bg.secondary,
      border: `1px solid ${isEditing ? colors.accent.blue : colors.border.secondary}`,
      borderRadius: '8px',
      transition: 'all 0.2s ease'
    }}>
      <span style={{ fontSize: '24px', flexShrink: 0 }}>
        {isIconUrl ? (
          <img src={link.icon} alt={link.name} style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
        ) : link.icon}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: colors.text.primary }}>
            {link.name}
          </span>
          {link.category && (
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              color: colors.text.muted,
              background: colors.bg.tertiary,
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {link.category}
            </span>
          )}
        </div>
        <div style={{
          fontSize: '12px',
          color: colors.text.dimmed,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {link.url}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <ActionButton icon="edit" onClick={onEdit} hoverColor={colors.accent.blue} />
        <ActionButton icon="delete" onClick={onRemove} hoverColor={colors.accent.red} />
      </div>
    </div>
  )
}

// Bouton d'action
function ActionButton({ icon, onClick, hoverColor }: { icon: 'edit' | 'delete'; onClick: () => void; hoverColor: string }) {
  const icons = {
    edit: <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>,
    delete: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>
  }

  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px',
        background: 'transparent',
        border: `1px solid ${colors.border.secondary}`,
        borderRadius: '6px',
        cursor: 'pointer',
        color: colors.text.muted,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = hoverColor
        e.currentTarget.style.color = hoverColor
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.border.secondary
        e.currentTarget.style.color = colors.text.muted
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
        {icons[icon]}
      </svg>
    </button>
  )
}

// Etat vide
function EmptyLinksState() {
  return (
    <div style={emptyStateStyles.container}>
      <svg viewBox="0 0 24 24" fill="none" stroke={colors.border.secondary} strokeWidth="2" style={emptyStateStyles.icon}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
      <p style={emptyStateStyles.text}>
        Aucun lien personnalise. Ajoutez vos premiers raccourcis.
      </p>
    </div>
  )
}

export default LinksSection
