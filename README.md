# Application de Gestion Clients

Application full-stack avec React (Frontend) et AdonisJS (Backend) pour la gestion de clients.

## 🏗️ Architecture

- **Frontend**: React + Vite + TailwindCSS + AG Grid
- **Backend**: AdonisJS 6 + PostgreSQL
- **Base de données**: PostgreSQL 15
- **Déploiement**: Coolify (Docker Compose)

## 📦 Structure du Projet

```
.
├── src/                    # Code source React
├── backend/               # Application AdonisJS
│   ├── app/              # Logique métier
│   ├── config/           # Configuration
│   ├── database/         # Migrations et seeders
│   └── Dockerfile        # Image Docker backend
├── docker-compose.yml     # Orchestration des services
├── Dockerfile            # Image Docker frontend
├── nginx.conf            # Configuration Nginx
└── DEPLOYMENT.md         # Guide de déploiement
```

## 🚀 Démarrage Local

### Prérequis

- Node.js 20+
- PostgreSQL 15+ (ou Docker)
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd <nom-du-projet>
```

2. **Installer les dépendances**

Frontend :
```bash
npm install
```

Backend :
```bash
cd backend
npm install
```

3. **Configurer les variables d'environnement**

À la racine :
```bash
cp .env.example .env
```

Backend :
```bash
cd backend
cp .env.example .env
# Éditez le fichier .env avec vos configurations
```

4. **Démarrer PostgreSQL**
```bash
# Avec Docker (recommandé)
cd backend
docker-compose up -d postgres
```

5. **Exécuter les migrations**
```bash
cd backend
node ace migration:run
```

6. **Démarrer les applications**

Terminal 1 - Backend :
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend :
```bash
npm run dev
```

L'application sera accessible sur :
- Frontend: http://localhost:5173
- Backend: http://localhost:3333

## 🐳 Déploiement avec Docker (Local)

```bash
# Build et démarrer tous les services
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

Services disponibles :
- Frontend: http://localhost
- Backend: http://localhost:3333
- PostgreSQL: localhost:5432

## ☁️ Déploiement sur Coolify

Consultez le guide détaillé dans [DEPLOYMENT.md](./DEPLOYMENT.md)

### Résumé rapide

1. Poussez votre code sur Git
2. Dans Coolify, créez une nouvelle ressource "Docker Compose"
3. Configurez les variables d'environnement :
   - `DB_PASSWORD`
   - `APP_KEY`
4. Déployez !

## 🔧 Scripts Disponibles

### Frontend
- `npm run dev` - Démarrage en mode développement
- `npm run build` - Build de production
- `npm run preview` - Aperçu du build

### Backend
- `npm run dev` - Démarrage avec hot reload
- `npm run build` - Build de production
- `npm start` - Démarrage en production
- `npm test` - Lancer les tests

## 📝 Variables d'Environnement

### Frontend
```env
VITE_API_URL=http://localhost:3333
```

### Backend
```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=gestion_clients

# Security
APP_KEY=your_app_key_here
```

## 🛠️ Technologies Utilisées

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- AG Grid Community
- Radix UI
- Axios

### Backend
- AdonisJS 6
- PostgreSQL
- Lucid ORM
- VineJS (validation)

## 📚 Documentation

- [AdonisJS Documentation](https://docs.adonisjs.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Coolify Documentation](https://coolify.io/docs)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence privée.
