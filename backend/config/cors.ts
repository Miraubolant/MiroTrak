import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration CORS pour AdonisJS
 */
const corsConfig = defineConfig({
  enabled: true,

  // Autoriser toutes les origines
  origin: true,

  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
