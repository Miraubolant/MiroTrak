# Instructions pour consulter la base de données PostgreSQL

## Informations de connexion

- **Hôte** : `localhost`
- **Port** : `5432`
- **Base de données** : `gestion_clients`
- **Utilisateur** : `postgres`
- **Mot de passe** : `postgres`

## Méthode 1 : Utiliser psql (ligne de commande)

### Installation
Si psql n'est pas installé, téléchargez PostgreSQL depuis : https://www.postgresql.org/download/

### Connexion
```bash
psql -h localhost -p 5432 -U postgres -d gestion_clients
```

### Commandes utiles
```sql
-- Lister toutes les tables
\dt

-- Voir la structure d'une table
\d clients
\d settings

-- Consulter tous les clients
SELECT * FROM clients;

-- Consulter les paramètres
SELECT * FROM settings;

-- Compter le nombre de clients
SELECT COUNT(*) FROM clients;

-- Quitter psql
\q
```

## Méthode 2 : pgAdmin (Interface graphique)

### Installation
Téléchargez pgAdmin depuis : https://www.pgadmin.org/download/

### Configuration
1. Ouvrez pgAdmin
2. Clic droit sur "Servers" → "Register" → "Server"
3. **General** :
   - Name : `MiroTrak Local`
4. **Connection** :
   - Host : `localhost`
   - Port : `5432`
   - Database : `gestion_clients`
   - Username : `postgres`
   - Password : `postgres`
5. Cliquez sur "Save"

### Navigation
- Servers → MiroTrak Local → Databases → gestion_clients → Schemas → public → Tables
- Clic droit sur une table → "View/Edit Data" → "All Rows"

## Méthode 3 : DBeaver (Gratuit et multiplateforme)

### Installation
Téléchargez DBeaver depuis : https://dbeaver.io/download/

### Configuration
1. Ouvrez DBeaver
2. Cliquez sur "Nouvelle connexion" (icône prise électrique)
3. Sélectionnez "PostgreSQL"
4. **Paramètres de connexion** :
   - Host : `localhost`
   - Port : `5432`
   - Database : `gestion_clients`
   - Username : `postgres`
   - Password : `postgres`
5. Cliquez sur "Test Connection" puis "Finish"

### Utilisation
- Double-cliquez sur votre connexion dans le navigateur
- Naviguez vers : Databases → gestion_clients → Schemas → public → Tables
- Double-cliquez sur une table pour voir les données

## Méthode 4 : TablePlus (Interface moderne)

### Installation
Téléchargez TablePlus depuis : https://tableplus.com/

### Configuration
1. Ouvrez TablePlus
2. Cliquez sur "Create a new connection"
3. Sélectionnez "PostgreSQL"
4. **Connection settings** :
   - Name : `MiroTrak`
   - Host/Socket : `localhost`
   - Port : `5432`
   - User : `postgres`
   - Password : `postgres`
   - Database : `gestion_clients`
5. Cliquez sur "Connect"

## Méthode 5 : VS Code avec extension PostgreSQL

### Installation
1. Ouvrez VS Code
2. Installez l'extension "PostgreSQL" (Chris Kolkman)
3. Cliquez sur l'icône PostgreSQL dans la barre latérale
4. Cliquez sur "+" pour ajouter une connexion
5. Entrez les informations :
   ```
   hostname: localhost
   user: postgres
   password: postgres
   port: 5432
   database: gestion_clients
   ```

### Utilisation
- Développez votre connexion dans la barre latérale
- Naviguez vers : gestion_clients → Schemas → public → Tables
- Clic droit sur une table → "Select Top 1000"

## Vérification Docker

Avant de vous connecter, assurez-vous que le conteneur PostgreSQL est en cours d'exécution :

```bash
# Vérifier l'état du conteneur
docker ps

# Si le conteneur n'est pas en cours d'exécution
cd backend
docker-compose up -d
```

## Requêtes SQL utiles

### Voir tous les clients
```sql
SELECT client_name, email, city, status, budget 
FROM clients 
ORDER BY created_at DESC;
```

### Voir les paramètres de l'application
```sql
SELECT key, value 
FROM settings;
```

### Statistiques des clients par statut
```sql
SELECT status, COUNT(*) as total, SUM(budget) as total_budget
FROM clients
GROUP BY status
ORDER BY total DESC;
```

### Clients par ville
```sql
SELECT city, COUNT(*) as nb_clients
FROM clients
GROUP BY city
ORDER BY nb_clients DESC;
```

### Rechercher un client
```sql
SELECT * FROM clients 
WHERE client_name ILIKE '%innovation%' 
   OR email ILIKE '%innovation%';
```

## String de connexion

Si vous avez besoin d'une chaîne de connexion complète :

```
postgresql://postgres:postgres@localhost:5432/gestion_clients
```

## Notes importantes

- Le conteneur Docker doit être en cours d'exécution pour que la base de données soit accessible
- Les données sont persistées dans un volume Docker, même si vous arrêtez le conteneur
- Pour réinitialiser complètement la base de données :
  ```bash
  cd backend
  node ace migration:rollback
  node ace migration:run
  node ace db:seed
  ```

## Support

Si vous rencontrez des problèmes de connexion :

1. Vérifiez que Docker Desktop est démarré
2. Vérifiez que le conteneur est en cours d'exécution : `docker ps`
3. Vérifiez les logs du conteneur : `docker logs postgres-gestion-clients`
4. Redémarrez le conteneur si nécessaire : `docker-compose restart`
