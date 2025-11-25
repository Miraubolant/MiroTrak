/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'

// Rate limiting général pour toutes les routes API (usage personnel)
export const throttle = limiter.define('global', () => {
  return limiter.allowRequests(100).every('1 minute')
})

// Rate limiting strict pour les endpoints de modification (POST/PUT/DELETE)
export const throttleWrite = limiter.define('write', () => {
  return limiter.allowRequests(30).every('1 minute')
})

// Rate limiting très strict pour les imports/exports massifs
export const throttleHeavy = limiter.define('heavy', () => {
  return limiter.allowRequests(5).every('1 minute')
})