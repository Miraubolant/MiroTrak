import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Client from '#models/client'
import Setting from '#models/setting'

export default class SeedDatabase extends BaseCommand {
  static commandName = 'db:seed'
  static description = 'Seed the database with sample data'

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Starting database seed...')

    // Créer des clients d'exemple
    const clients = [
      {
        clientName: 'TechCorp Solutions',
        contactPerson: 'Marie Dubois',
        email: 'marie.dubois@techcorp.fr',
        phone: '+33 1 23 45 67 89',
        company: 'TechCorp',
        address: '15 Avenue des Champs-Élysées',
        city: 'Paris',
        postalCode: '75008',
        country: 'France',
        projectType: 'Application Web',
        technologies: 'React, Node.js, PostgreSQL',
        budget: 50000,
        status: 'En cours',
        progress: 65,
        notes: 'Client prioritaire - Deadline fin décembre',
        website: 'https://techcorp.fr'
      },
      {
        clientName: 'InnoTech SARL',
        contactPerson: 'Pierre Martin',
        email: 'p.martin@innotech.com',
        phone: '+33 2 34 56 78 90',
        company: 'InnoTech',
        address: '42 Rue de la République',
        city: 'Lyon',
        postalCode: '69002',
        country: 'France',
        projectType: 'E-commerce',
        technologies: 'Vue.js, Express, MongoDB',
        budget: 35000,
        status: 'En attente',
        progress: 30,
        notes: 'En attente de validation client',
        website: 'https://innotech.com'
      },
      {
        clientName: 'Digital Agency Pro',
        contactPerson: 'Sophie Laurent',
        email: 'sophie@digitalpro.fr',
        phone: '+33 3 45 67 89 01',
        company: 'Digital Pro',
        address: '8 Boulevard Haussmann',
        city: 'Marseille',
        postalCode: '13001',
        country: 'France',
        projectType: 'Application Mobile',
        technologies: 'React Native, Firebase',
        budget: 45000,
        status: 'Terminé',
        progress: 100,
        notes: 'Projet livré avec succès',
        website: 'https://digitalpro.fr'
      }
    ]

    for (const clientData of clients) {
      await Client.create(clientData)
      this.logger.info(`Created client: ${clientData.clientName}`)
    }

    // Créer des paramètres par défaut
    const settings = [
      {
        key: 'visible_columns',
        value: JSON.stringify(['clientName', 'contactPerson', 'email', 'phone', 'projectType', 'budget']),
        type: 'json',
        description: 'Colonnes visibles dans la grille'
      },
      {
        key: 'custom_links',
        value: JSON.stringify([
          { id: '1', name: 'GitHub', url: 'https://github.com', icon: '💻' },
          { id: '2', name: 'Documentation', url: 'https://docs.anthropic.com', icon: '📚' }
        ]),
        type: 'json',
        description: 'Liens personnalisés de la sidebar'
      }
    ]

    for (const settingData of settings) {
      await Setting.create(settingData)
      this.logger.info(`Created setting: ${settingData.key}`)
    }

    this.logger.success('Database seeded successfully!')
  }
}
