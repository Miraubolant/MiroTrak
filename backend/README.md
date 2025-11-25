# Backend AdonisJS - API Gestion Clients

Backend développé avec AdonisJS 6 et PostgreSQL pour l'application de gestion de clients.

## 🚀 Installation

### 1. Prérequis

- Node.js 20+ installé
- PostgreSQL 14+ installé et en cours d'exécution
- npm ou yarn

### 2. Installer PostgreSQL

#### Windows
Téléchargez depuis [PostgreSQL.org](https://www.postgresql.org/download/windows/)

#### Avec Docker
```bash
docker run --name postgres-gestion -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### 3. Créer la base de données

```bash
# Connectez-vous à PostgreSQL
psql -U postgres

# Créez la base de données
CREATE DATABASE gestion_clients;

# Quittez psql
\q
```

### 4. Configuration

Le fichier `.env` a été créé automatiquement. Vérifiez et modifiez si nécessaire :

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=gestion_clients
```

### 5. Installer les dépendances

```bash
npm install
```

### 6. Exécuter les migrations

```bash
node ace migration:run
```

### 7. Peupler la base de données (optionnel)

```bash
node ace db:seed
```

Cette commande créera 3 clients d'exemple et les paramètres par défaut.

### 8. Démarrer le serveur

```bash
npm run dev
```

Le serveur démarrera sur **http://localhost:3333**

## 📡 Endpoints API

### Clients

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/clients` | Récupérer tous les clients |
| GET | `/api/clients/:id` | Récupérer un client par ID |
| POST | `/api/clients` | Créer un nouveau client |
| PUT | `/api/clients/:id` | Mettre à jour un client |
| DELETE | `/api/clients/:id` | Supprimer un client |

### Paramètres

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/settings` | Récupérer tous les paramètres |
| GET | `/api/settings/:key` | Récupérer un paramètre par clé |
| POST | `/api/settings` | Créer/mettre à jour un paramètre |
| POST | `/api/settings/bulk` | Mettre à jour plusieurs paramètres |
| DELETE | `/api/settings/:key` | Supprimer un paramètre |

## 🗂️ Structure du projet

```
backend/
├── app/
│   ├── controllers/
│   │   ├── clients_controller.ts      # CRUD clients
│   │   └── settings_controller.ts     # CRUD paramètres
│   ├── models/
│   │   ├── client.ts                  # Modèle Client
│   │   └── setting.ts                 # Modèle Setting
│   └── validators/
│       └── create_client.ts           # Validation clients
├── commands/
│   └── seed_database.ts               # Commande de seed
├── config/
│   ├── cors.ts                        # Configuration CORS
│   └── database.ts                    # Configuration DB
├── database/
│   └── migrations/
│       ├── *_create_clients_table.ts
│       └── *_create_settings_table.ts
└── start/
    └── routes.ts                      # Définition des routes
```

## 🔧 Commandes utiles

```bash
# Créer une nouvelle migration
node ace make:migration nom_migration

# Exécuter les migrations
node ace migration:run

# Annuler la dernière migration
node ace migration:rollback

# Créer un modèle
node ace make:model NomModele

# Créer un contrôleur
node ace make:controller NomController

# Voir toutes les routes
node ace list:routes

# Mode développement avec rechargement automatique
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start
```

## 🔒 CORS

Le CORS est configuré pour accepter les requêtes depuis :
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000`
- `http://127.0.0.1:5173`

Pour modifier, éditez `config/cors.ts`.

## 🛠️ Technologies utilisées

- **AdonisJS 6** - Framework Node.js
- **Lucid ORM** - ORM pour PostgreSQL
- **VineJS** - Validation de données
- **PostgreSQL** - Base de données relationnelle

## 📝 Schéma de la base de données

### Table `clients`
- id (primary key)
- client_name
- contact_person
- email (unique)
- phone
- company
- address, city, postal_code, country
- project_type
- technologies
- budget
- start_date, end_date
- status, progress
- notes, website
- created_at, updated_at

### Table `settings`
- id (primary key)
- key (unique)
- value
- type (string, json, boolean, number)
- description
- created_at, updated_at

## 🐛 Dépannage

### Erreur de connexion à PostgreSQL

Vérifiez que PostgreSQL est bien démarré :
```bash
# Windows (services)
services.msc

# Ou avec pg_ctl
pg_ctl status
```

### Erreur de migration

Réinitialisez la base de données :
```bash
node ace migration:rollback --batch=0
node ace migration:run
```

### Port 3333 déjà utilisé

Modifiez le port dans `.env` :
```env
PORT=3334
```

## 📚 Documentation

- [AdonisJS Documentation](https://docs.adonisjs.com/)
- [Lucid ORM](https://lucid.adonisjs.com/)
- [VineJS Validation](https://vinejs.dev/)
