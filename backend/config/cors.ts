import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration CORS pour AdonisJS
 */
const corsConfig = defineConfig({
  enabled: true,

  // Restreindre aux domaines autorisés uniquement (sécurité production)
  origin: (origin) => {
    const allowedOrigins = [
      'https://mirotrak.miraubolant.com',
      // Autoriser localhost en développement
      process.env.NODE_ENV !== 'production' ? 'http://localhost:5173' : null,
      process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:5173' : null,
    ].filter(Boolean)

    return allowedOrigins.includes(origin || '') || origin === null
  },

  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
