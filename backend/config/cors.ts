import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration CORS pour AdonisJS
 */
const corsConfig = defineConfig({
  enabled: true,
  
  origin: (origin) => {
    // Autoriser les requêtes sans origin (ex: curl, Postman)
    if (!origin) return true

    // Autoriser tous les sous-domaines de sslip.io
    if (origin.endsWith('.sslip.io')) return true

    // Autoriser localhost avec différents ports
    const allowedLocalhost = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ]

    return allowedLocalhost.includes(origin)
  },

  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig

