// Main component
export { default as SettingsModal } from './SettingsModal'

// Types
export type { ColumnConfig, CustomLink } from './SettingsModal'

// Sections (for advanced usage)
export { ColumnsSection } from './sections/ColumnsSection'
export { LinksSection } from './sections/LinksSection'
export { EmailSection } from './sections/EmailSection'
export { DatabaseSection } from './sections/DatabaseSection'

// Hooks (for reuse in other components)
export { useDraggable } from './hooks/useDraggable'
export { useLinks } from './hooks/useLinks'

// Styles (for extending)
export * from './settings.styles'
