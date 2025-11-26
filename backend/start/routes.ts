/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { throttle, throttleWrite, throttleHeavy } from '#start/limiter'

const AuthController = () => import('#controllers/auth_controller')
const ClientsController = () => import('#controllers/clients_controller')
const SettingsController = () => import('#controllers/settings_controller')
const TemplatesController = () => import('#controllers/templates_controller')
const SubscriptionsController = () => import('#controllers/subscriptions_controller')
const AiPhotosController = () => import('#controllers/ai_photos_controller')
const PromptsController = () => import('#controllers/prompts_controller')
const EventsController = () => import('#controllers/events_controller')
const DatabaseExportController = () => import('#controllers/database_export_controller')

router.get('/', async () => {
  return {
    hello: 'world',
    message: 'API Gestion Clients - AdonisJS'
  }
})

// Health check endpoint
router.get('/api/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString()
  }
})

// Routes d'authentification
router.group(() => {
  router.post('/login', [AuthController, 'login']).use(throttleWrite)
  router.post('/logout', [AuthController, 'logout']).use(throttleWrite)
  router.get('/me', [AuthController, 'me']).use(throttle)
}).prefix('/api/auth')

// Routes pour les clients
router.group(() => {
  router.get('/', [ClientsController, 'index']).use(throttle)
  router.get('/:id', [ClientsController, 'show']).use(throttle)
  router.post('/', [ClientsController, 'store']).use(throttleWrite)
  router.put('/:id', [ClientsController, 'update']).use(throttleWrite)
  router.delete('/:id', [ClientsController, 'destroy']).use(throttleWrite)
}).prefix('/api/clients')

// Routes pour les paramètres
router.group(() => {
  router.get('/', [SettingsController, 'index']).use(throttle)
  router.get('/:key', [SettingsController, 'show']).use(throttle)
  router.post('/', [SettingsController, 'store']).use(throttleWrite)
  router.post('/bulk', [SettingsController, 'bulkUpdate']).use(throttleWrite)
  router.delete('/:key', [SettingsController, 'destroy']).use(throttleWrite)
}).prefix('/api/settings')

// Routes pour les templates
router.group(() => {
  router.get('/', [TemplatesController, 'index']).use(throttle)
  router.get('/:type', [TemplatesController, 'show']).use(throttle)
  router.post('/', [TemplatesController, 'store']).use(throttleWrite)
  router.post('/bulk', [TemplatesController, 'bulkUpdate']).use(throttleWrite)
}).prefix('/api/templates')

// Routes pour les abonnements
router.group(() => {
  router.get('/', [SubscriptionsController, 'index']).use(throttle)
  router.get('/client/:clientId', [SubscriptionsController, 'getByClient']).use(throttle)
  router.get('/:id', [SubscriptionsController, 'show']).use(throttle)
  router.post('/', [SubscriptionsController, 'store']).use(throttleWrite)
  router.put('/:id', [SubscriptionsController, 'update']).use(throttleWrite)
  router.delete('/:id', [SubscriptionsController, 'destroy']).use(throttleWrite)
}).prefix('/api/subscriptions')

// Routes pour les photos IA
router.group(() => {
  router.get('/', [AiPhotosController, 'index']).use(throttle)
  router.post('/bulk-delete', [AiPhotosController, 'bulkDestroy']).use(throttleWrite)
  router.post('/bulk-store', [AiPhotosController, 'bulkStore']).use(throttleWrite)
  router.get('/:id', [AiPhotosController, 'show']).use(throttle)
  router.post('/', [AiPhotosController, 'store']).use(throttleWrite)
  router.put('/:id', [AiPhotosController, 'update']).use(throttleWrite)
  router.delete('/:id', [AiPhotosController, 'destroy']).use(throttleWrite)
}).prefix('/api/ai-photos')

// Routes pour les prompts
router.group(() => {
  router.get('/', [PromptsController, 'index']).use(throttle)
  router.get('/categories', [PromptsController, 'categories']).use(throttle)
  router.get('/:id', [PromptsController, 'show']).use(throttle)
  router.post('/', [PromptsController, 'store']).use(throttleWrite)
  router.put('/:id', [PromptsController, 'update']).use(throttleWrite)
  router.delete('/:id', [PromptsController, 'destroy']).use(throttleWrite)
}).prefix('/api/prompts')

// Routes pour les événements du calendrier
router.group(() => {
  router.get('/', [EventsController, 'index']).use(throttle)
  router.get('/:id', [EventsController, 'show']).use(throttle)
  router.post('/', [EventsController, 'store']).use(throttleWrite)
  router.put('/:id', [EventsController, 'update']).use(throttleWrite)
  router.delete('/:id', [EventsController, 'destroy']).use(throttleWrite)
}).prefix('/api/events')

// Routes pour l'export/import de la base de données
router.group(() => {
  router.get('/tables', [DatabaseExportController, 'getTables']).use(throttle)
  router.get('/export/json', [DatabaseExportController, 'exportJson']).use(throttleHeavy)
  router.get('/export/csv/:table', [DatabaseExportController, 'exportCsv']).use(throttleHeavy)
  router.get('/export/excel/:table', [DatabaseExportController, 'exportExcel']).use(throttleHeavy)
  router.post('/import/json', [DatabaseExportController, 'importJson']).use(throttleHeavy)
}).prefix('/api/database')
