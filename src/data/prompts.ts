/**
 * Prompts par défaut optimisés pour le développement web
 */

export interface DefaultPrompt {
  id: string
  title: string
  category: string
  content: string
}

export const defaultPrompts: DefaultPrompt[] = [
  // Marketing
  {
    id: 'marketing-1',
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
    id: 'marketing-2',
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
    id: 'marketing-3',
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

  // Développement
  {
    id: 'dev-1',
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
    id: 'dev-2',
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
    id: 'dev-3',
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
    id: 'dev-4',
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
    id: 'dev-5',
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

  // Design
  {
    id: 'design-1',
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
    id: 'design-2',
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

  // Business
  {
    id: 'business-1',
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
    id: 'business-2',
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
    id: 'business-3',
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

  // Support
  {
    id: 'support-1',
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
    id: 'support-2',
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
]
