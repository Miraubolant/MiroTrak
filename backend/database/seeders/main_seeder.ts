import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Client from '#models/client'
import Setting from '#models/setting'
import Prompt from '#models/prompt'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // Créer l'utilisateur admin
    await User.firstOrCreate(
      { email: 'victor@mirault.com' },
      {
        email: 'victor@mirault.com',
        password: 'Aqsze188665!',
        fullName: 'Victor Mirault'
      }
    )

    // Créer les clients
    await Client.firstOrCreate(
      { email: 'mariejobard84@gmail.com' },
      {
        clientName: 'Marie Jobard',
        contactPerson: 'Marie Jobard',
        email: 'mariejobard84@gmail.com',
        phone: '+33 6 58 75 69 09',
        company: 'Marie Jobard',
        projectType: 'Site Vitrine',
        technologies: 'React, Vite, TypeScript, Adonis',
        budget: 800,
        status: 'En attente',
        progress: 0,
        website: ''
      }
    )

    await Client.firstOrCreate(
      { email: '3R1' },
      {
        clientName: 'Tools.miraubolant.com',
        contactPerson: '3R1',
        email: '',
        company: 'Tools.miraubolant.com',
        projectType: 'Suite Outils CP',
        technologies: 'React, Vite, TypeScript',
        budget: 0,
        status: 'Terminé',
        progress: 100,
        website: ''
      }
    )

    await Client.firstOrCreate(
      { email: 'miraubolant.com' },
      {
        clientName: 'Miraubolant.com',
        contactPerson: 'Victor Mirault',
        email: '',
        phone: '+33 6 49 51 76 80',
        company: 'Miraubolant.com',
        projectType: 'Portfolio',
        technologies: 'React, Vite, TypeScript',
        budget: 0,
        status: 'En attente',
        progress: 0,
        website: ''
      }
    )

    await Client.firstOrCreate(
      { email: 'vintdress.com' },
      {
        clientName: 'VintDress.com',
        contactPerson: 'Victor Mirault',
        email: '',
        phone: '+33 6 49 51 76 80',
        company: 'VintDress.com',
        projectType: 'Saas Vinted IA',
        technologies: 'React, Vite, TypeScript',
        budget: 0,
        status: 'En attente',
        progress: 0,
        website: ''
      }
    )

    await Client.firstOrCreate(
      { email: 'miremover.fr' },
      {
        clientName: 'Miremover.fr',
        contactPerson: 'Arlette',
        email: '',
        company: 'Miremover.fr',
        projectType: 'Saas Service Photo',
        technologies: 'React, Vite, TypeScript,Python , Bria IA',
        budget: 0,
        status: 'En attente',
        progress: 0,
        website: ''
      }
    )

    await Client.firstOrCreate(
      { email: 'nassiri.merwan@outlook.fr' },
      {
        clientName: 'Fun-Event.com',
        contactPerson: 'Merwan Nassiri',
        email: 'nassiri.merwan@outlook.fr',
        phone: '+33 7 63 56 20 61',
        company: 'Fun-Event.com',
        projectType: 'Site Vitrine',
        technologies: 'React, Vite, TypeScript',
        budget: 400,
        status: 'En cours',
        progress: 50,
        website: ''
      }
    )

    // Créer des paramètres par défaut
    await Setting.createMany([
      {
        key: 'visible_columns',
        value: JSON.stringify(['clientName', 'contactPerson', 'email', 'phone', 'projectType', 'budget']),
        type: 'json',
        description: 'Colonnes visibles dans la grille'
      },
      {
        key: 'custom_links',
        value: JSON.stringify([
          { id: '1', name: 'GitHub', url: 'https://github.com', icon: 'https://github.githubassets.com/favicons/favicon.svg', category: 'Développement' },
          { id: '2', name: 'Supabase', url: 'https://supabase.com', icon: 'https://supabase.com/favicon/favicon-32x32.png', category: 'Base de données' },
          { id: '3', name: 'Hostinger', url: 'https://www.hostinger.fr', icon: 'https://www.hostinger.fr/favicon.ico', category: 'Hébergement' },
          { id: '4', name: 'Formspree', url: 'https://formspree.io', icon: 'https://formspree.io/favicon.ico', category: 'Outils' },
          { id: '5', name: 'Imgur', url: 'https://imgur.com', icon: 'https://imgur.com/favicon.ico', category: 'Médias' },
          { id: '6', name: 'Coolify', url: 'https://coolify.miraubolant.com/login', icon: 'https://coolify.io/favicon.png', category: 'Déploiement' },
          { id: '7', name: 'Google Drive', url: 'https://drive.google.com', icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png', category: 'Stockage' },
          { id: '8', name: 'Bolt.new', url: 'https://bolt.new', icon: '⚡', category: 'Outils' },
          { id: '9', name: 'shadcn/ui', url: 'https://ui.shadcn.com', icon: 'https://ui.shadcn.com/favicon.ico', category: 'UI/Design' },
          { id: '10', name: 'Context7', url: 'https://context7.com', icon: 'https://context7.com/favicon.ico', category: 'Documentation' }
        ]),
        type: 'json',
        description: 'Liens personnalisés de la sidebar'
      },
      {
        key: 'stack_technique',
        value: JSON.stringify({
          frontend: 'React 18, TypeScript, Vite, AG Grid',
          backend: 'AdonisJS 6, Node.js 20',
          database: 'PostgreSQL 15, Lucid ORM',
          deployment: 'Docker, Coolify',
          versionControl: 'Git, GitHub',
          tools: 'VS Code, Postman, Figma, Docker Desktop',
          workflow: '1. Analyse des besoins et wireframes\n2. Setup projet (Vite + React + TypeScript)\n3. Développement des composants UI\n4. Backend AdonisJS avec API REST\n5. Intégration base de données PostgreSQL\n6. Tests et validation\n7. Déploiement via Docker/Coolify',
          notes: 'Stack moderne et performante pour applications web complètes.\n\nCommandes utiles:\n- npm run dev (frontend)\n- node ace migration:run (migrations)\n- docker-compose up -d (PostgreSQL)\n\nRessources:\n- AdonisJS: https://docs.adonisjs.com\n- React: https://react.dev\n- AG Grid: https://www.ag-grid.com'
        }),
        type: 'json',
        description: 'Stack technique et workflow de développement'
      },
      {
        key: 'pdf_templates',
        value: JSON.stringify({
          devis: {
            name: 'Devis',
            content: `DEVIS N° {{documentNumber}}
Date: {{currentDate}}

CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{clientName}}
Contact: {{contactPerson}}
Email: {{email}}
Tel: {{phone}}

PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: {{projectType}}
Technologies: {{technologies}}
Début prévu: {{startDate}}
Échéance: {{endDate}}

DÉTAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Développement {{projectType}}
- Stack technique: {{technologies}}
- Hébergement et déploiement
- Formation et documentation
- Support post-livraison (30 jours)

MONTANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total HT: {{budget}} €
TVA (20%): {{budgetTVA}} €
Total TTC: {{budgetTTC}} €

Conditions de paiement:
- 30% à la commande
- 40% en cours de développement
- 30% à la livraison

Validité du devis: 30 jours

Cordialement,
Victor Mirault - MiroTrak`,
            enabled: true
          },
          rapport: {
            name: 'Rapport d\'avancement',
            content: `RAPPORT D'AVANCEMENT
{{clientName}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Statut: {{status}}
Progression: {{progress}}%

OBJECTIFS DU PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: {{projectType}}
Technologies: {{technologies}}
Début: {{startDate}}
Échéance: {{endDate}}

RÉALISATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Setup initial du projet
- Configuration de l'environnement
- Développement des fonctionnalités principales

EN COURS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Développement des fonctionnalités restantes
- Tests et intégration

NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{notes}}

PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Revue du code et tests
- Préparation du déploiement
- Formation utilisateur

Date du rapport: {{currentDate}}`,
            enabled: true
          },
          facture: {
            name: 'Facture',
            content: `FACTURE N° {{documentNumber}}
Date: {{currentDate}}

CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{clientName}}
{{company}}
{{address}}
{{postalCode}} {{city}}
{{country}}

CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{{contactPerson}}
Email: {{email}}
Tel: {{phone}}

PRESTATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Développement {{projectType}}
Technologies: {{technologies}}
Période: du {{startDate}} au {{endDate}}

MONTANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total HT: {{budget}} €
TVA (20%): {{budgetTVA}} €
Total TTC: {{budgetTTC}} €

Paiement: À réception de facture
Mode de paiement: Virement bancaire

Cordialement,
Victor Mirault - MiroTrak`,
            enabled: true
          }
        }),
        type: 'json',
        description: 'Templates PDF personnalisables'
      },
      {
        key: 'email_templates',
        value: JSON.stringify({
          devis: {
            subject: 'Devis pour votre projet {{projectType}}',
            body: `Bonjour {{contactPerson}},

Veuillez trouver ci-joint le devis pour votre projet {{projectType}}.

Le montant total s'élève à {{budgetTTC}} € TTC.

N'hésitez pas à me contacter si vous avez des questions.

Cordialement,
Victor Mirault`
          },
          rapport: {
            subject: 'Rapport d\'avancement - {{projectType}}',
            body: `Bonjour {{contactPerson}},

Voici le rapport d'avancement de votre projet.

Progression actuelle: {{progress}}%
Statut: {{status}}

Vous trouverez tous les détails dans le document PDF ci-joint.

Cordialement,
Victor Mirault`
          },
          facture: {
            subject: 'Facture N° {{documentNumber}} - {{projectType}}',
            body: `Bonjour {{contactPerson}},

Veuillez trouver ci-joint la facture pour les prestations réalisées.

Montant total: {{budgetTTC}} € TTC

Merci de procéder au règlement selon les modalités convenues.

Cordialement,
Victor Mirault`
          }
        }),
        type: 'json',
        description: 'Templates d\'emails par type de document'
      }
    ])

    // Créer les prompts par défaut
    await Prompt.createMany([
      {
        title: 'Email de bienvenue client',
        category: 'Marketing',
        content: `Objet : Bienvenue chez [NOM_ENTREPRISE] !

Bonjour [NOM_CLIENT],

Nous sommes ravis de vous accueillir parmi nos clients !

Votre projet [NOM_PROJET] est maintenant lancé et notre équipe est mobilisée pour vous offrir la meilleure expérience possible.

Prochaines étapes :
- Réunion de lancement : [DATE]
- Premier livrable : [DATE]
- Point de suivi : [DATE]

Votre interlocuteur dédié : [NOM_CONTACT]
Email : [EMAIL]
Téléphone : [TELEPHONE]

N'hésitez pas à nous contacter pour toute question.

Cordialement,
L'équipe [NOM_ENTREPRISE]`
      },
      {
        title: 'Post LinkedIn - Lancement projet',
        category: 'Marketing',
        content: `🚀 Nouveau projet en cours !

Nous sommes fiers d'accompagner [NOM_CLIENT] dans le développement de [TYPE_PROJET].

🎯 Objectifs :
• [OBJECTIF_1]
• [OBJECTIF_2]
• [OBJECTIF_3]

💡 Technologies utilisées :
#React #NodeJS #PostgreSQL #Docker

Un grand merci à toute l'équipe pour leur engagement !

#WebDevelopment #Innovation #DigitalTransformation`
      },
      {
        title: 'Email de relance prospect',
        category: 'Marketing',
        content: `Objet : Suite à notre échange - Proposition pour [NOM_PROJET]

Bonjour [NOM_PROSPECT],

Je me permets de revenir vers vous concernant votre projet [NOM_PROJET].

Avez-vous eu l'occasion de consulter notre proposition ?

Pour rappel, nous vous proposons :
✓ [SERVICE_1]
✓ [SERVICE_2]
✓ [SERVICE_3]

Budget estimé : [MONTANT]
Délai de réalisation : [DUREE]

Je reste à votre disposition pour échanger sur votre projet.

Seriez-vous disponible pour un appel cette semaine ?

Cordialement,
[VOTRE_NOM]`
      },
      {
        title: 'Message de commit - Feature',
        category: 'Développement',
        content: `feat([module]): [description courte]

Ajout de [fonctionnalité] permettant de [objectif].

Modifications :
- [changement 1]
- [changement 2]
- [changement 3]

Tests :
- [test 1]
- [test 2]

Closes #[numéro_issue]`
      },
      {
        title: 'Message de commit - Bugfix',
        category: 'Développement',
        content: `fix([module]): [description courte]

Correction du bug [description] qui causait [problème].

Cause identifiée : [explication]

Solution appliquée :
- [solution 1]
- [solution 2]

Tests ajoutés :
- [test 1]
- [test 2]

Fixes #[numéro_issue]`
      },
      {
        title: 'Pull Request - Description',
        category: 'Développement',
        content: `## 📋 Description
[Description détaillée des changements]

## 🎯 Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## ✅ Checklist
- [ ] Le code suit les conventions du projet
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Pas de warnings/erreurs
- [ ] Review effectuée

## 🧪 Tests
[Description des tests effectués]

## 📸 Screenshots
[Si applicable]

## 🔗 Issues liées
Closes #[numéro]`
      },
      {
        title: 'README - Structure de projet',
        category: 'Développement',
        content: `# [NOM_PROJET]

## 📝 Description
[Description du projet]

## 🚀 Technologies
- **Frontend**: [technos]
- **Backend**: [technos]
- **Database**: [technos]
- **Deployment**: [technos]

## 📦 Installation

\`\`\`bash
# Clone
git clone [url]

# Install dependencies
npm install

# Configuration
cp .env.example .env

# Start dev server
npm run dev
\`\`\`

## 🏗️ Structure
\`\`\`
├── src/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── ...
├── tests/
└── docs/
\`\`\`

## 📄 License
[Type de licence]

## 👥 Contributors
- [Nom] - [Role]`
      },
      {
        title: 'Documentation API - Endpoint',
        category: 'Développement',
        content: `### [METHODE] /api/[endpoint]

**Description**: [Description de l'endpoint]

**Authentification**: [Requise/Non requise]

**Paramètres**:
\`\`\`json
{
  "param1": "string (required)",
  "param2": "number (optional)"
}
\`\`\`

**Réponse success (200)**:
\`\`\`json
{
  "success": true,
  "data": {}
}
\`\`\`

**Erreurs possibles**:
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

**Exemple**:
\`\`\`bash
curl -X [METHODE] \\
  https://api.example.com/[endpoint] \\
  -H "Authorization: Bearer [token]" \\
  -d '{"param1": "value"}'
\`\`\``
      },
      {
        title: 'Brief créatif - Site web',
        category: 'Design',
        content: `# Brief Créatif - [NOM_PROJET]

## Client
[Nom du client]

## Contexte
[Description du contexte et des besoins]

## Objectifs
1. [Objectif 1]
2. [Objectif 2]
3. [Objectif 3]

## Cible
- **Âge**: [tranche d'âge]
- **Profil**: [description]
- **Comportement**: [description]

## Style souhaité
- **Ambiance**: [description]
- **Couleurs**: [palette]
- **Typographie**: [style]
- **Références**: [liens]

## Livrables
- [ ] Maquettes desktop
- [ ] Maquettes mobile
- [ ] Guide de style
- [ ] Assets

## Planning
- **Début**: [date]
- **Livraison**: [date]

## Budget
[Montant]`
      },
      {
        title: 'Spécifications UX - Fonctionnalité',
        category: 'Design',
        content: `# Spécifications UX - [NOM_FONCTIONNALITÉ]

## User Story
En tant que [type d'utilisateur],
Je veux [action],
Afin de [bénéfice].

## Parcours utilisateur
1. [Étape 1]
2. [Étape 2]
3. [Étape 3]

## Éléments d'interface
- **Composants**: [liste]
- **Interactions**: [description]
- **États**: [actif, hover, disabled, etc.]

## Comportements
- **Desktop**: [description]
- **Mobile**: [description]
- **Tablette**: [description]

## Contraintes
- [Contrainte 1]
- [Contrainte 2]

## Points d'attention
- Accessibilité: [WCAG AA]
- Performance: [< 3s]
- Responsive: [breakpoints]

## Critères d'acceptation
- [ ] [Critère 1]
- [ ] [Critère 2]
- [ ] [Critère 3]`
      },
      {
        title: 'Devis projet web',
        category: 'Business',
        content: `DEVIS N° [NUMERO]
Date : [DATE]

**Client**
[Nom]
[Adresse]
[Email]

**Projet** : [NOM_PROJET]

## Prestations

### 1. [PHASE_1]
- [Prestation 1] : [MONTANT]€
- [Prestation 2] : [MONTANT]€
- [Prestation 3] : [MONTANT]€

Subtotal : [MONTANT]€

### 2. [PHASE_2]
- [Prestation 1] : [MONTANT]€
- [Prestation 2] : [MONTANT]€

Subtotal : [MONTANT]€

**Total HT** : [MONTANT]€
**TVA (20%)** : [MONTANT]€
**Total TTC** : [MONTANT]€

## Conditions
- Acompte : 30% à la commande
- Solde : à la livraison
- Validité : 30 jours
- Délai : [DUREE]

Devis valable jusqu'au [DATE]

Signature :                    Signature client :`
      },
      {
        title: 'Rapport d\'avancement projet',
        category: 'Business',
        content: `# Rapport d'avancement - [NOM_PROJET]
**Période** : [DATE_DEBUT] - [DATE_FIN]

## 📊 Statut global
**Avancement** : [XX]%
**Budget consommé** : [XX]%
**Respect du planning** : [Oui/Non]

## ✅ Tâches complétées
- [Tâche 1]
- [Tâche 2]
- [Tâche 3]

## 🚧 En cours
- [Tâche 1] - [XX]%
- [Tâche 2] - [XX]%

## 📅 Prochaines étapes
- [Semaine prochaine] : [tâche]
- [Dans 2 semaines] : [tâche]

## ⚠️ Points de vigilance
- [Point 1]
- [Point 2]

## 💰 Financier
- Budget initial : [MONTANT]€
- Dépensé : [MONTANT]€
- Restant : [MONTANT]€

## 📝 Notes
[Observations diverses]

**Prochain point** : [DATE]`
      },
      {
        title: 'Compte-rendu réunion client',
        category: 'Business',
        content: `# Compte-rendu réunion - [NOM_PROJET]

**Date** : [DATE]
**Participants** : [Liste]
**Durée** : [XX]min

## 📋 Ordre du jour
1. [Point 1]
2. [Point 2]
3. [Point 3]

## 💬 Discussions

### [Point 1]
- [Discussion]
- **Décision** : [décision prise]
- **Action** : [qui fait quoi]

### [Point 2]
- [Discussion]
- **Décision** : [décision prise]
- **Action** : [qui fait quoi]

## ✅ Actions à mener
| Action | Responsable | Échéance |
|--------|-------------|----------|
| [Action 1] | [Nom] | [Date] |
| [Action 2] | [Nom] | [Date] |

## 📅 Prochaine réunion
**Date** : [DATE]
**Objectif** : [description]

## 📎 Documents partagés
- [Document 1]
- [Document 2]`
      },
      {
        title: 'Email support - Résolution ticket',
        category: 'Support',
        content: `Objet : [TICKET #XXX] - Résolu : [TITRE_PROBLEME]

Bonjour [NOM_CLIENT],

Votre demande concernant [description] a été traitée.

## Problème identifié
[Description du problème]

## Solution appliquée
[Description de la solution]

## Actions effectuées
- [Action 1]
- [Action 2]
- [Action 3]

Le problème est maintenant résolu. Vous pouvez vérifier en [instructions].

Si vous rencontrez de nouveau ce problème ou avez d'autres questions, n'hésitez pas à nous contacter.

Cordialement,
[VOTRE_NOM]
Support technique`
      },
      {
        title: 'Documentation utilisateur - Fonctionnalité',
        category: 'Support',
        content: `# Guide utilisateur - [NOM_FONCTIONNALITÉ]

## 📖 Introduction
[Description de la fonctionnalité]

## 🎯 Objectif
Cette fonctionnalité vous permet de [objectif].

## 📝 Étapes

### 1. [Étape 1]
[Description]

\`\`\`
[Instructions ou code si applicable]
\`\`\`

### 2. [Étape 2]
[Description]

### 3. [Étape 3]
[Description]

## 💡 Conseils
- [Conseil 1]
- [Conseil 2]
- [Conseil 3]

## ⚠️ Points d'attention
- [Point 1]
- [Point 2]

## ❓ FAQ

**Q: [Question]**
R: [Réponse]

**Q: [Question]**
R: [Réponse]

## 📞 Support
En cas de problème, contactez-nous :
- Email: [email]
- Tel: [telephone]`
      }
    ])
  }
}
