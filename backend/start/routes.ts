/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
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

// Routes pour les clients
router.group(() => {
  router.get('/', [ClientsController, 'index'])
  router.get('/:id', [ClientsController, 'show'])
  router.post('/', [ClientsController, 'store'])
  router.put('/:id', [ClientsController, 'update'])
  router.delete('/:id', [ClientsController, 'destroy'])
}).prefix('/api/clients')

// Routes pour les paramètres
router.group(() => {
  router.get('/', [SettingsController, 'index'])
  router.get('/:key', [SettingsController, 'show'])
  router.post('/', [SettingsController, 'store'])
  router.post('/bulk', [SettingsController, 'bulkUpdate'])
  router.delete('/:key', [SettingsController, 'destroy'])
}).prefix('/api/settings')

// Routes pour les templates
router.group(() => {
  router.get('/', [TemplatesController, 'index'])
  router.get('/:type', [TemplatesController, 'show'])
  router.post('/', [TemplatesController, 'store'])
  router.post('/bulk', [TemplatesController, 'bulkUpdate'])
}).prefix('/api/templates')

// Routes pour les abonnements
router.group(() => {
  router.get('/', [SubscriptionsController, 'index'])
  router.get('/client/:clientId', [SubscriptionsController, 'getByClient'])
  router.get('/:id', [SubscriptionsController, 'show'])
  router.post('/', [SubscriptionsController, 'store'])
  router.put('/:id', [SubscriptionsController, 'update'])
  router.delete('/:id', [SubscriptionsController, 'destroy'])
}).prefix('/api/subscriptions')

// Routes pour les photos IA
router.group(() => {
  router.get('/', [AiPhotosController, 'index'])
  router.post('/bulk-delete', [AiPhotosController, 'bulkDestroy'])
  router.post('/bulk-store', [AiPhotosController, 'bulkStore'])
  router.get('/:id', [AiPhotosController, 'show'])
  router.post('/', [AiPhotosController, 'store'])
  router.put('/:id', [AiPhotosController, 'update'])
  router.delete('/:id', [AiPhotosController, 'destroy'])
}).prefix('/api/ai-photos')

// Routes pour les prompts
router.group(() => {
  router.get('/', [PromptsController, 'index'])
  router.get('/categories', [PromptsController, 'categories'])
  router.get('/:id', [PromptsController, 'show'])
  router.post('/', [PromptsController, 'store'])
  router.put('/:id', [PromptsController, 'update'])
  router.delete('/:id', [PromptsController, 'destroy'])
}).prefix('/api/prompts')

// Routes pour les événements du calendrier
router.group(() => {
  router.get('/', [EventsController, 'index'])
  router.get('/:id', [EventsController, 'show'])
  router.post('/', [EventsController, 'store'])
  router.put('/:id', [EventsController, 'update'])
  router.delete('/:id', [EventsController, 'destroy'])
}).prefix('/api/events')

// Routes pour l'export/import de la base de données
router.group(() => {
  router.get('/tables', [DatabaseExportController, 'getTables'])
  router.get('/export/json', [DatabaseExportController, 'exportJson'])
  router.get('/export/csv/:table', [DatabaseExportController, 'exportCsv'])
  router.get('/export/excel/:table', [DatabaseExportController, 'exportExcel'])
  router.post('/import/json', [DatabaseExportController, 'importJson'])
}).prefix('/api/database')
