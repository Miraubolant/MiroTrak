# Changelog - MiroTrak

## Version 2.1 - 22 Novembre 2024

### 🐳 Infrastructure Docker & Base de données

#### Mise en place de PostgreSQL avec Docker
- ✅ **Conteneurisation de PostgreSQL** pour simplifier le développement
  - Commande de création : `docker run --name postgres-gestion -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=gestion_clients -p 5432:5432 -d postgres`
  - Base de données `gestion_clients` créée automatiquement
  - Port mappé : `5432:5432` (conteneur → machine locale)
  - Mode détaché pour exécution en arrière-plan

#### Avantages de Docker PostgreSQL
- **Isolation** : PostgreSQL s'exécute dans un environnement isolé
- **Portabilité** : Même configuration pour toute l'équipe
- **Simplicité** : Pas d'installation système requise
- **Nettoyage facile** : Suppression totale en une commande
- **Gestion rapide** : Démarrage/arrêt en quelques secondes

#### Commandes Docker utiles
```bash
# Démarrer le conteneur PostgreSQL
docker start postgres-gestion

# Arrêter le conteneur
docker stop postgres-gestion

# Voir les conteneurs actifs
docker ps

# Voir les logs
docker logs postgres-gestion

# Supprimer complètement (avec données)
docker rm -f postgres-gestion

# Accéder au shell PostgreSQL
docker exec -it postgres-gestion psql -U postgres -d gestion_clients
```

### 🔧 Backend (AdonisJS)

#### Migrations de base de données
- ✅ **6 migrations exécutées avec succès** (189ms)
  1. `create_users_table` - Gestion des utilisateurs
  2. `create_access_tokens_table` - Tokens d'authentification
  3. `create_clients_table` - Données clients principales
  4. `create_settings_table` - Paramètres de l'application
  5. `create_add_logo_to_clients_table` - Ajout colonne logo
  6. `create_create_subscriptions_table` - Gestion des abonnements

#### Configuration de connexion
- **Host** : `127.0.0.1` (localhost)
- **Port** : `5432` (PostgreSQL standard)
- **Database** : `gestion_clients`
- **User** : `postgres`
- **Password** : `postgres`

#### Serveur backend
- ✅ **Serveur AdonisJS démarré** sur `http://localhost:3333`
- ✅ **Hot Module Replacement (HMR)** activé
- ✅ Mode développement avec rechargement automatique
- ✅ Temps de démarrage : ~870ms
- ✅ Logger Pino avec timestamps

#### API REST disponible
- `GET /api/clients` - Liste des clients
- `GET /api/clients/:id` - Client par ID
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Mettre à jour un client
- `DELETE /api/clients/:id` - Supprimer un client
- `GET /api/settings` - Liste des paramètres
- `POST /api/settings` - Créer/modifier un paramètre
- `POST /api/settings/bulk` - Mise à jour en masse
- `GET /api/subscriptions` - Liste des abonnements

### 🎨 Frontend (React + Vite)

#### Connexion au backend
- ✅ **Configuration Axios** pointant vers `http://localhost:3333`
- ✅ Gestion des erreurs de connexion (`ERR_CONNECTION_REFUSED`)
- ✅ Rechargement automatique des données au démarrage
- ✅ Intercepteurs pour les erreurs réseau

#### Flux de données
1. **Composant React** fait un appel API (via Axios)
2. **Requête HTTP** envoyée à `localhost:3333`
3. **Backend AdonisJS** traite la requête
4. **Lucid ORM** communique avec PostgreSQL (localhost:5432)
5. **PostgreSQL Docker** retourne les données
6. **Backend** formate la réponse JSON
7. **Frontend** reçoit et affiche les données

#### Gestion d'état
- Hooks personnalisés : `useClients`, `useSubscriptions`
- État local avec `useState`
- Effets de bord avec `useEffect`
- Rafraîchissement automatique des données

### 🔄 Workflow de développement

#### Séquence de démarrage
1. **Démarrer Docker PostgreSQL**
   ```bash
   docker start postgres-gestion
   # OU si première fois
   docker run --name postgres-gestion -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=gestion_clients -p 5432:5432 -d postgres
   ```

2. **Exécuter les migrations** (si nécessaire)
   ```bash
   cd backend
   node ace migration:run
   ```

3. **Démarrer le backend**
   ```bash
   cd backend
   npm run dev
   # Serveur sur http://localhost:3333
   ```

4. **Démarrer le frontend**
   ```bash
   npm run dev
   # Application sur http://localhost:5173
   ```

#### Architecture complète
```
┌─────────────────────────────────────────────────────┐
│ Frontend (React + Vite) - Port 5173                 │
│ - Composants UI (Dashboard, Modals, Tables)        │
│ - Axios pour les requêtes HTTP                      │
│ - Hooks personnalisés (useClients, etc.)           │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/REST (localhost:3333)
                   ↓
┌─────────────────────────────────────────────────────┐
│ Backend (AdonisJS) - Port 3333                      │
│ - Controllers (ClientsController, etc.)            │
│ - Models (Client, Setting, Subscription)           │
│ - Validators (VineJS)                               │
│ - Routes API (/api/clients, /api/settings)         │
└──────────────────┬──────────────────────────────────┘
                   │ Lucid ORM (SQL)
                   ↓
┌─────────────────────────────────────────────────────┐
│ PostgreSQL (Docker) - Port 5432                     │
│ - Base: gestion_clients                             │
│ - Tables: users, clients, settings, subscriptions  │
│ - Conteneur: postgres-gestion                       │
└─────────────────────────────────────────────────────┘
```

### 🛠️ Résolution de problèmes

#### Problème : `ERR_CONNECTION_REFUSED` sur port 3333
**Cause** : Backend AdonisJS non démarré  
**Solution** : `cd backend && npm run dev`

#### Problème : `ECONNREFUSED 127.0.0.1:5432`
**Cause** : PostgreSQL Docker non démarré  
**Solution** : `docker start postgres-gestion`

#### Problème : Migration échoue
**Cause** : Base de données non accessible  
**Solution** : Vérifier que Docker PostgreSQL est en cours d'exécution avec `docker ps`

### 📊 État actuel du système

#### Backend
- ✅ Serveur actif sur `localhost:3333`
- ✅ Base de données connectée et migrée
- ✅ 6 tables créées et fonctionnelles
- ✅ Mode HMR activé

#### Base de données
- ✅ PostgreSQL 16+ dans Docker
- ✅ Conteneur `postgres-gestion` actif
- ✅ Base `gestion_clients` créée
- ✅ Migrations version 2 appliquées

#### Frontend
- ✅ Application React sur `localhost:5173`
- ✅ Connexion API fonctionnelle
- ✅ Chargement des données réussi

### 🔐 Variables d'environnement (.env)

```env
# Backend (backend/.env)
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=q6Se_doZLmsHEDHq-MGUfUG0DGxTqJu8
NODE_ENV=development

# PostgreSQL
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=gestion_clients
```

### 📝 Notes techniques

- **Transparence Docker** : L'application backend ne sait pas que PostgreSQL tourne dans Docker, elle se connecte à `localhost:5432` comme avec une installation native
- **Isolation des ports** : Frontend (5173), Backend (3333), PostgreSQL (5432) utilisent des ports différents
- **Persistence des données** : Les données PostgreSQL sont stockées dans le conteneur Docker (non persistantes par défaut)
- **HMR Backend** : Les modifications de code backend se rechargent automatiquement sans redémarrer le serveur
- **CORS configuré** : Le backend accepte les requêtes du frontend (localhost:5173)

---

**Dernière mise à jour** : 22 Novembre 2024  
**Version** : 2.1  
**Développeur** : Victor Mirault

---

## Version 2.0 - 20 Novembre 2024

### 🎨 Interface utilisateur

#### Page de connexion
- ✅ Mise à jour complète du design pour correspondre au thème du dashboard
- ✅ Couleurs alignées avec GitHub Dark theme
  - Background : `#0d1117`
  - Cards : `#161b22`
  - Borders : `#21262d`, `#30363d`
  - Texte : `#c9d1d9`, `#8b949e`
  - Accent : `#58a6ff` (bleu GitHub)
  - Bouton : `#238636` (vert GitHub)
- ✅ Suppression des options "Se souvenir de moi" et "Mot de passe oublié"
- ✅ Suppression du lien d'inscription
- ✅ Messages d'erreur stylisés
- ✅ Formulaire simplifié avec validation stricte

#### Tableau de données
- ✅ Colonne "Actions" déplacée à la fin du tableau (pinned: 'right')
- ✅ Meilleure organisation visuelle des colonnes

### 🔐 Authentification

- ✅ Compte unique implémenté
  - Email : `victor@mirault`
  - Mot de passe : `Aqsze188665!`
- ✅ Validation stricte des identifiants
- ✅ Messages d'erreur clairs en français

### 🗄️ Base de données

#### Clients (10 nouveaux)
1. **TechCorp Solutions** - Paris - Application Web - 50 000€
2. **InnoTech SARL** - Lyon - E-commerce - 35 000€
3. **Digital Agency Pro** - Marseille - Application Mobile - 45 000€
4. **WebCreative Studio** - Toulouse - Site Vitrine - 8 500€
5. **StartUp Innovation** - Bordeaux - SaaS Platform - 120 000€
6. **Consulting Expert** - Paris - Dashboard Analytics - 65 000€
7. **E-Shop France** - Nantes - E-commerce - 42 000€
8. **HealthTech Solutions** - Nice - Application Médicale - 95 000€
9. **FoodDelivery App** - Lille - Application Mobile - 78 000€
10. **GreenEnergy Corp** - Strasbourg - Plateforme IoT - 150 000€

#### Liens personnalisés (avec logos réels)
1. **GitHub** - https://github.com
   - Logo : favicon.svg GitHub
   - Catégorie : Développement

2. **Supabase** - https://supabase.com
   - Logo : favicon-32x32.png
   - Catégorie : Base de données

3. **Hostinger** - https://www.hostinger.fr
   - Logo : favicon.ico
   - Catégorie : Hébergement

4. **Formspree** - https://formspree.io
   - Logo : favicon.ico
   - Catégorie : Outils

5. **Imgur** - https://imgur.com
   - Logo : favicon.ico
   - Catégorie : Médias

6. **Coolify** - https://coolify.miraubolant.com/login
   - Logo : PNG transparent (cdn.coollabs.io)
   - Catégorie : Déploiement

7. **Google Drive** - https://drive.google.com
   - Logo : PNG 32dp (ssl.gstatic.com)
   - Catégorie : Stockage

8. **Bolt.new** - https://bolt.new
   - Logo : ⚡ emoji
   - Catégorie : Outils

#### Stack Technique
- ✅ Workflow complet documenté (7 étapes)
  1. Analyse des besoins et wireframes
  2. Setup projet (Vite + React + TypeScript)
  3. Développement des composants UI
  4. Backend AdonisJS avec API REST
  5. Intégration base de données PostgreSQL
  6. Tests et validation
  7. Déploiement via Docker/Coolify

- ✅ Commandes utiles ajoutées
  - `npm run dev` (frontend)
  - `node ace migration:run` (migrations)
  - `docker-compose up -d` (PostgreSQL)

- ✅ Liens de documentation
  - AdonisJS: https://docs.adonisjs.com
  - React: https://react.dev
  - AG Grid: https://www.ag-grid.com

### 📚 Documentation

#### Nouveau fichier : DATABASE_INSTRUCTIONS.md
- ✅ Instructions complètes pour consulter la base PostgreSQL
- ✅ 5 méthodes détaillées :
  1. psql (ligne de commande)
  2. pgAdmin (interface graphique officielle)
  3. DBeaver (gratuit et multiplateforme)
  4. TablePlus (interface moderne)
  5. Extension VS Code PostgreSQL

- ✅ Informations de connexion
  - Host : localhost
  - Port : 5432
  - Database : gestion_clients
  - User : postgres
  - Password : postgres

- ✅ Requêtes SQL utiles
  - Voir tous les clients
  - Consulter les paramètres
  - Statistiques par statut
  - Clients par ville
  - Recherche de clients

- ✅ String de connexion complète
- ✅ Commandes Docker utiles
- ✅ Instructions de dépannage

### 🔧 Améliorations techniques

#### Backend (AdonisJS)
- ✅ Seeder mis à jour avec données réalistes
- ✅ Base de données purgée et repeuplée
- ✅ API testée et fonctionnelle

#### Frontend (React)
- ✅ Composant Login.tsx refactorisé
  - Validation des identifiants côté client
  - Messages d'erreur intégrés
  - Suppression des fonctionnalités inutiles

- ✅ Styles CSS harmonisés
  - login.css aligné avec main.css
  - Cohérence des couleurs GitHub Dark
  - Animations et transitions fluides

### 📊 Données de test

**Total clients** : 10  
**Budget total** : 688 500€  
**Répartition par statut** :
- En cours : 6 clients
- Terminé : 2 clients
- En attente : 2 clients

**Répartition par ville** :
- Paris : 2 clients
- Autres villes : 1 client chacune

### 🚀 Prochaines étapes suggérées

1. **Sécurité**
   - [ ] Hasher le mot de passe côté backend
   - [ ] Ajouter JWT pour l'authentification
   - [ ] Implémenter un système de refresh token

2. **Fonctionnalités**
   - [ ] Ajouter la recherche/filtrage dans le tableau
   - [ ] Exporter les données en CSV/Excel
   - [ ] Dashboard avec statistiques et graphiques
   - [ ] Gestion des documents clients

3. **Performance**
   - [ ] Pagination côté serveur
   - [ ] Mise en cache des données
   - [ ] Optimisation des requêtes SQL

4. **UX/UI**
   - [ ] Mode sombre/clair
   - [ ] Notifications toast
   - [ ] Drag & drop pour les colonnes
   - [ ] Vue mobile responsive

### 📝 Notes importantes

- Le projet utilise un compte unique (pas d'inscription possible)
- Les données sont persistées dans PostgreSQL via Docker
- Le frontend tourne sur le port 3001
- Le backend tourne sur le port 3333
- PostgreSQL est accessible sur le port 5432

### 🛠️ Commandes utiles

```bash
# Démarrer le frontend
npm run dev

# Démarrer le backend
cd backend
npm run dev

# Démarrer PostgreSQL
cd backend
docker-compose up -d

# Réinitialiser la base de données
cd backend
node ace migration:rollback
node ace migration:run
node ace db:seed

# Voir les logs Docker
docker logs postgres-gestion

# Accéder au shell PostgreSQL
docker exec -it postgres-gestion psql -U postgres -d gestion_clients
```

---

**Dernière mise à jour** : 20 Novembre 2024  
**Version** : 2.0  
**Développeur** : Victor Mirault
