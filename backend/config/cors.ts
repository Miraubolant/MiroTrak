import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,
  // Permettre les requêtes depuis le frontend Vite
  origin: (origin) => {
    const allowedOrigins = [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000',
      'http://localhost:3001', // Vite alternative port
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3001',
    ]
    return allowedOrigins.includes(origin || '') || origin === null
  },
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
