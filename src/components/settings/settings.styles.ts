import { CSSProperties } from 'react'

// Palette de couleurs GitHub Dark (coherent avec le site)
export const colors = {
  bg: {
    primary: '#0d1117',
    secondary: '#161b22',
    tertiary: '#21262d',
    card: '#161b22',
    hover: '#30363d'
  },
  border: {
    primary: '#21262d',
    secondary: '#30363d',
    hover: '#484f58',
    active: '#58a6ff',
    glow: 'rgba(88, 166, 255, 0.3)'
  },
  text: {
    primary: '#c9d1d9',
    secondary: '#c9d1d9',
    muted: '#8b949e',
    dimmed: '#6e7681'
  },
  accent: {
    blue: '#58a6ff',
    blueLight: '#79c0ff',
    purple: '#a371f7',
    purpleLight: '#bc8cff',
    green: '#3fb950',
    greenLight: '#56d364',
    red: '#f85149',
    redLight: '#ff7b72',
    orange: '#d29922',
    cyan: '#39c5cf'
  }
}

// Ombres
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 12px rgba(0, 0, 0, 0.4)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
  glow: (color: string) => `0 0 20px ${color}`,
  card: '0 4px 20px rgba(0, 0, 0, 0.3)'
}

// Styles de section
export const sectionStyles = {
  container: {
    marginBottom: '24px'
  } as CSSProperties,

  header: {
    marginBottom: '24px'
  } as CSSProperties,

  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: colors.text.primary,
    margin: '0 0 8px 0'
  } as CSSProperties,

  description: {
    fontSize: '14px',
    color: colors.text.muted,
    margin: 0,
    lineHeight: 1.5
  } as CSSProperties
}

// Styles de carte
export const cardStyles = {
  container: {
    background: colors.bg.secondary,
    border: `1px solid ${colors.border.secondary}`,
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.2s ease'
  } as CSSProperties,

  containerSmall: {
    background: colors.bg.secondary,
    border: `1px solid ${colors.border.secondary}`,
    borderRadius: '8px',
    padding: '16px',
    transition: 'all 0.2s ease'
  } as CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  } as CSSProperties,

  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.text.primary,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  } as CSSProperties
}

// Styles de formulaire
export const formStyles = {
  grid: (columns: string = '1fr') => ({
    display: 'grid',
    gridTemplateColumns: columns,
    gap: '16px',
    marginBottom: '16px'
  } as CSSProperties),

  label: {
    display: 'block',
    fontSize: '13px',
    color: colors.text.muted,
    marginBottom: '8px',
    fontWeight: 500
  } as CSSProperties,

  input: {
    width: '100%',
    padding: '10px 12px',
    background: colors.bg.primary,
    border: `1px solid ${colors.border.secondary}`,
    borderRadius: '6px',
    color: colors.text.primary,
    fontSize: '14px',
    transition: 'all 0.2s ease',
    outline: 'none'
  } as CSSProperties,

  inputFocus: {
    borderColor: colors.accent.blue,
    boxShadow: `0 0 0 3px ${colors.border.glow}`
  } as CSSProperties,

  textarea: {
    width: '100%',
    padding: '12px',
    background: colors.bg.primary,
    border: `1px solid ${colors.border.secondary}`,
    borderRadius: '6px',
    color: colors.text.primary,
    fontSize: '14px',
    fontFamily: "'Courier New', monospace",
    resize: 'vertical' as const,
    transition: 'all 0.2s ease',
    lineHeight: 1.5
  } as CSSProperties
}

// Styles de grille
export const gridStyles = {
  autoFill: (minWidth: string = '280px') => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
    gap: '12px'
  } as CSSProperties),

  flexColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  } as CSSProperties
}

// Styles d'elements de liste
export const listItemStyles = {
  container: (isActive: boolean = false) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    background: isActive ? colors.bg.tertiary : colors.bg.secondary,
    border: `1px solid ${isActive ? colors.accent.blue : colors.border.secondary}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  } as CSSProperties),

  info: {
    flex: 1,
    minWidth: 0
  } as CSSProperties,

  name: {
    fontSize: '14px',
    fontWeight: 500,
    color: colors.text.primary,
    marginBottom: '2px'
  } as CSSProperties,

  subtitle: {
    fontSize: '12px',
    color: colors.text.dimmed,
    fontFamily: "'Courier New', monospace"
  } as CSSProperties,

  badge: {
    fontSize: '11px',
    fontWeight: 600,
    color: colors.text.muted,
    background: colors.bg.tertiary,
    padding: '2px 8px',
    borderRadius: '6px'
  } as CSSProperties
}

// Styles de boutons d'action
export const actionButtonStyles = {
  container: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0
  } as CSSProperties,

  button: {
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
  } as CSSProperties
}

// Styles d'etat vide
export const emptyStateStyles = {
  container: {
    textAlign: 'center' as const,
    padding: '48px 24px',
    background: colors.bg.secondary,
    border: `1px solid ${colors.border.secondary}`,
    borderRadius: '12px'
  } as CSSProperties,

  icon: {
    width: '48px',
    height: '48px',
    margin: '0 auto 16px',
    color: colors.border.secondary
  } as CSSProperties,

  text: {
    fontSize: '14px',
    color: colors.text.muted,
    margin: 0
  } as CSSProperties
}

// Styles d'info box
export const infoBoxStyles = {
  container: {
    marginTop: '20px',
    padding: '14px 16px',
    background: colors.bg.secondary,
    border: `1px solid ${colors.border.secondary}`,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  } as CSSProperties,

  title: {
    fontSize: '14px',
    color: colors.text.primary,
    fontWeight: 500
  } as CSSProperties,

  subtitle: {
    fontSize: '12px',
    color: colors.text.muted,
    marginTop: '2px'
  } as CSSProperties
}

// Styles de spinner
export const spinnerStyles = {
  container: {
    width: '40px',
    height: '40px',
    border: `3px solid ${colors.border.secondary}`,
    borderTop: `3px solid ${colors.accent.blue}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  } as CSSProperties
}

// Styles d'icone avec fond
export const iconBoxStyles = {
  container: (color: string = colors.accent.blue) => ({
    width: '48px',
    height: '48px',
    background: `${color}15`,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  } as CSSProperties)
}

// Styles de checkbox personnalisee
export const checkboxStyles = {
  container: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: `1px solid ${colors.border.secondary}`,
    background: colors.bg.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0
  } as CSSProperties,

  checked: {
    background: colors.accent.blue,
    borderColor: colors.accent.blue
  } as CSSProperties
}

// Styles de tag/badge
export const tagStyles = {
  default: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    background: colors.bg.tertiary,
    color: colors.text.muted
  } as CSSProperties,

  colored: (color: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    background: `${color}20`,
    color: color
  } as CSSProperties)
}
