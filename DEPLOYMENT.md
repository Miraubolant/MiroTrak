# Guide de Déploiement sur Coolify

Ce guide vous explique comment déployer votre application sur Coolify.

## 📋 Prérequis

1. Un compte Coolify configuré
2. Un dépôt Git (GitHub, GitLab, ou Gitea)
3. Accès SSH à votre serveur Coolify

## 🚀 Étapes de Déploiement

### 1. Pousser votre code sur Git

```bash
# Ajouter tous les fichiers
git add .

# Créer un commit
git commit -m "Initial commit - Ready for Coolify deployment"

# Ajouter votre remote (remplacez par votre URL)
git remote add origin https://github.com/votre-username/votre-repo.git

# Pousser sur la branche main
git push -u origin main
```

### 2. Créer le projet dans Coolify

1. **Connectez-vous à votre interface Coolify**
2. **Créez un nouveau projet** ou sélectionnez un projet existant
3. Cliquez sur **"Add New Resource"**
4. Sélectionnez **"Docker Compose"**

### 3. Configurer la source Git

1. **Source Type**: Git Repository
2. **Repository URL**: Collez l'URL de votre dépôt
3. **Branch**: `main` (ou votre branche principale)
4. **Build Pack**: Docker Compose
5. **Docker Compose File**: `docker-compose.yml`

### 4. Configurer les Variables d'Environnement

Dans l'onglet "Environment Variables" de Coolify, ajoutez :

#### Variables Obligatoires

```env
DB_PASSWORD=votre_mot_de_passe_secure
APP_KEY=votre_app_key_generee
```

#### Générer l'APP_KEY

Pour générer la clé APP_KEY, exécutez localement :

```bash
cd backend
node ace generate:key
```

Copiez la clé générée et ajoutez-la dans Coolify.

#### Variables Optionnelles

```env
# Si vous voulez un custom API URL
VITE_API_URL=https://votre-backend.coolify.app
```

### 5. Configuration des Domaines

#### Pour le Frontend
- Allez dans l'onglet "Domains" du service `frontend`
- Ajoutez votre domaine : `app.votre-domaine.com`
- Coolify générera automatiquement un certificat SSL

#### Pour le Backend (si accès direct nécessaire)
- Allez dans l'onglet "Domains" du service `backend`
- Ajoutez : `api.votre-domaine.com`

### 6. Déployer

1. Cliquez sur **"Deploy"**
2. Coolify va :
   - Cloner votre dépôt
   - Build les images Docker
   - Démarrer les services (frontend, backend, postgres)
   - Configurer le réseau entre les services

### 7. Vérifier le Déploiement

Vérifiez les logs dans Coolify :
- **Frontend logs**: Vérifiez que Nginx démarre correctement
- **Backend logs**: Vérifiez que AdonisJS démarre sur le port 3333
- **PostgreSQL logs**: Vérifiez que la base de données est prête

## 🔄 Déploiements Automatiques

Pour activer les déploiements automatiques :

1. Dans Coolify, allez dans **"Settings"** de votre application
2. Activez **"Automatic Deployment"**
3. Coolify configurera un webhook sur votre dépôt Git
4. Chaque push sur `main` déclenchera un nouveau déploiement

## 🗃️ Base de Données

### Migrations

Pour exécuter les migrations après le déploiement :

1. Allez dans le service `backend` dans Coolify
2. Cliquez sur **"Terminal"**
3. Exécutez :

```bash
node ace migration:run
```

### Backup

Les données PostgreSQL sont persistées dans un volume Docker `postgres_data`.

Pour configurer les backups automatiques dans Coolify :
1. Allez dans le service `postgres`
2. Onglet **"Backups"**
3. Configurez la fréquence des backups

## 🐛 Dépannage

### Le backend ne se connecte pas à la base de données

Vérifiez que :
- `DB_PASSWORD` est correctement défini
- Le service `postgres` est démarré
- Les logs du backend pour plus de détails

### Le frontend ne charge pas

Vérifiez :
- Les logs Nginx
- Que le build Vite s'est terminé avec succès
- La configuration nginx.conf

### Erreur APP_KEY

Si vous voyez des erreurs liées à APP_KEY :
1. Générez une nouvelle clé : `node ace generate:key`
2. Mettez à jour la variable dans Coolify
3. Redéployez

## 📊 Services Disponibles

Après déploiement, vous aurez :

- **Frontend (React)**: Port 80, accessible via votre domaine
- **Backend (AdonisJS)**: Port 3333, accessible via `/api` depuis le frontend
- **PostgreSQL**: Port 5432, accessible uniquement en interne

## 🔐 Sécurité

- Les mots de passe sont configurés via les variables d'environnement
- SSL/TLS est automatiquement configuré par Coolify
- La base de données n'est pas exposée publiquement

## 📝 Notes Importantes

1. **Ne committez jamais** votre fichier `.env` avec des vraies valeurs
2. Utilisez `.env.example` comme template
3. Configurez toutes les variables dans Coolify avant de déployer
4. Testez localement avec `docker-compose up` avant de pousser

## 🆘 Besoin d'Aide ?

- Documentation Coolify: https://coolify.io/docs
- Logs en temps réel: Disponibles dans l'interface Coolify
- Terminal: Accessible pour chaque service dans Coolify
