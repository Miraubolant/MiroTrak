import type { HttpContext } from '@adonisjs/core/http'
import Client from '#models/client'
import AiPhoto from '#models/ai_photo'
import Subscription from '#models/subscription'
import Setting from '#models/setting'
import Event from '#models/event'
import Prompt from '#models/prompt'
import db from '@adonisjs/lucid/services/db'
import ExcelJS from 'exceljs'

export default class DatabaseExportController {
  /**
   * Exporter toute la base de données en JSON
   */
  async exportJson({ response }: HttpContext) {
    try {
      const [clients, aiPhotos, subscriptions, settings, events, prompts] = await Promise.all([
        Client.all(),
        AiPhoto.all(),
        Subscription.all(),
        Setting.all(),
        Event.all(),
        Prompt.all(),
      ])

      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        data: {
          clients: clients.map(c => c.serialize()),
          aiPhotos: aiPhotos.map(p => p.serialize()),
          subscriptions: subscriptions.map(s => s.serialize()),
          settings: settings.map(s => s.serialize()),
          events: events.map(e => e.serialize()),
          prompts: prompts.map(p => p.serialize()),
        },
      }

      response.header('Content-Type', 'application/json')
      response.header('Content-Disposition', `attachment; filename="database-export-${new Date().toISOString().split('T')[0]}.json"`)
      
      return response.send(JSON.stringify(exportData, null, 2))
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de l\'export de la base de données'
      })
    }
  }

  /**
   * Exporter une table spécifique en CSV
   */
  async exportCsv({ params, response }: HttpContext) {
    try {
      const { table } = params
      
      let data: any[] = []
      let headers: string[] = []

      switch (table) {
        case 'clients':
          data = await Client.all()
          headers = [
            'id', 'clientName', 'contactPerson', 'email', 'phone', 'company',
            'address', 'city', 'postalCode', 'country', 'projectType', 
            'technologies', 'budget', 'status', 'progress', 'notes', 
            'website', 'logo', 'createdAt', 'updatedAt'
          ]
          break
        case 'ai_photos':
          data = await AiPhoto.all()
          headers = ['id', 'name', 'imagePrompt', 'videoPrompt', 'imageUrl', 'createdAt', 'updatedAt']
          break
        case 'subscriptions':
          data = await Subscription.all()
          headers = [
            'id', 'clientId', 'serviceName', 'provider', 'cost', 'billingCycle',
            'startDate', 'endDate', 'status', 'autoRenew', 'notes', 
            'createdAt', 'updatedAt'
          ]
          break
        case 'events':
          data = await Event.all()
          headers = [
            'id', 'title', 'start', 'end', 'backgroundColor', 'borderColor',
            'client', 'type', 'description', 'allDay', 'createdAt', 'updatedAt'
          ]
          break
        case 'prompts':
          data = await Prompt.all()
          headers = ['id', 'title', 'category', 'content', 'createdAt', 'updatedAt']
          break
        default:
          return response.badRequest({ message: 'Table non supportée' })
      }

      // Construire le CSV
      const csvRows = [headers.join(',')]
      
      for (const item of data) {
        const serialized = item.serialize()
        const values = headers.map(header => {
          const value = serialized[header]
          if (value === null || value === undefined) return ''
          // Échapper les virgules et guillemets
          const stringValue = String(value).replace(/"/g, '""')
          return `"${stringValue}"`
        })
        csvRows.push(values.join(','))
      }

      const csv = csvRows.join('\n')

      response.header('Content-Type', 'text/csv; charset=utf-8')
      response.header('Content-Disposition', `attachment; filename="${table}-export-${new Date().toISOString().split('T')[0]}.csv"`)
      
      return response.send('\uFEFF' + csv) // BOM pour Excel UTF-8
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de l\'export CSV'
      })
    }
  }

  /**
   * Exporter une table en Excel (XLSX)
   */
  async exportExcel({ params, response }: HttpContext) {
    try {
      const { table } = params
      
      let data: any[] = []
      let headers: { key: string; header: string; width?: number }[] = []
      let sheetName = ''

      switch (table) {
        case 'clients':
          data = (await Client.all()).map(c => c.serialize())
          sheetName = 'Clients'
          headers = [
            { key: 'id', header: 'ID', width: 10 },
            { key: 'clientName', header: 'Nom du client', width: 25 },
            { key: 'contactPerson', header: 'Contact', width: 25 },
            { key: 'email', header: 'Email', width: 30 },
            { key: 'phone', header: 'Téléphone', width: 20 },
            { key: 'company', header: 'Entreprise', width: 25 },
            { key: 'projectType', header: 'Type de projet', width: 20 },
            { key: 'technologies', header: 'Technologies', width: 30 },
            { key: 'budget', header: 'Budget', width: 15 },
            { key: 'status', header: 'Statut', width: 15 },
            { key: 'progress', header: 'Progression', width: 15 },
          ]
          break
        case 'ai_photos':
          data = (await AiPhoto.all()).map(p => p.serialize())
          sheetName = 'Images IA'
          headers = [
            { key: 'id', header: 'ID', width: 10 },
            { key: 'name', header: 'Nom', width: 30 },
            { key: 'imagePrompt', header: 'Prompt Image', width: 50 },
            { key: 'videoPrompt', header: 'Prompt Vidéo', width: 50 },
            { key: 'imageUrl', header: 'URL', width: 60 },
          ]
          break
        case 'subscriptions':
          data = (await Subscription.all()).map(s => s.serialize())
          sheetName = 'Abonnements'
          headers = [
            { key: 'id', header: 'ID', width: 10 },
            { key: 'serviceName', header: 'Service', width: 25 },
            { key: 'provider', header: 'Fournisseur', width: 25 },
            { key: 'cost', header: 'Coût', width: 15 },
            { key: 'billingCycle', header: 'Cycle', width: 15 },
            { key: 'status', header: 'Statut', width: 15 },
          ]
          break
        case 'events':
          data = (await Event.all()).map(e => e.serialize())
          sheetName = 'Événements'
          headers = [
            { key: 'id', header: 'ID', width: 10 },
            { key: 'title', header: 'Titre', width: 30 },
            { key: 'start', header: 'Début', width: 20 },
            { key: 'end', header: 'Fin', width: 20 },
            { key: 'client', header: 'Client', width: 25 },
            { key: 'type', header: 'Type', width: 15 },
          ]
          break
        case 'prompts':
          data = (await Prompt.all()).map(p => p.serialize())
          sheetName = 'Prompts'
          headers = [
            { key: 'id', header: 'ID', width: 10 },
            { key: 'title', header: 'Titre', width: 30 },
            { key: 'category', header: 'Catégorie', width: 20 },
            { key: 'content', header: 'Contenu', width: 60 },
          ]
          break
        default:
          return response.badRequest({ message: 'Table non supportée' })
      }

      // Créer le workbook Excel
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet(sheetName)

      // Définir les colonnes
      worksheet.columns = headers

      // Styliser l'en-tête
      worksheet.getRow(1).font = { bold: true, size: 12 }
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF21262D' }
      }
      worksheet.getRow(1).font.color = { argb: 'FFE6EDF3' }

      // Ajouter les données
      data.forEach(item => {
        worksheet.addRow(item)
      })

      // Générer le buffer
      const buffer = await workbook.xlsx.writeBuffer()

      response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      response.header('Content-Disposition', `attachment; filename="${table}-export-${new Date().toISOString().split('T')[0]}.xlsx"`)
      
      return response.send(buffer)
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de l\'export Excel'
      })
    }
  }

  /**
   * Importer des données depuis JSON
   */
  async importJson({ request, response }: HttpContext) {
    try {
      const importData = request.body()
      
        hasData: !!importData.data,
        clientsCount: importData.data?.clients?.length || 0,
        promptsCount: importData.data?.prompts?.length || 0,
        eventsCount: importData.data?.events?.length || 0
      })

      if (!importData.data) {
        return response.badRequest({ message: 'Format de données invalide' })
      }

      const trx = await db.transaction()

      try {
        // VIDER les tables existantes (sauf settings qui est mis à jour)
        await trx.from('subscriptions').delete()
        await trx.from('events').delete()
        await trx.from('ai_photos').delete()
        await trx.from('prompts').delete()
        await trx.from('clients').delete()

        // Import des clients (avec IDs originaux)
        if (importData.data.clients && Array.isArray(importData.data.clients)) {
          for (const clientData of importData.data.clients) {
            // Convertir camelCase vers snake_case pour PostgreSQL
            const dataToInsert = {
              id: clientData.id,
              client_name: clientData.clientName,
              contact_person: clientData.contactPerson,
              email: clientData.email,
              phone: clientData.phone,
              company: clientData.company,
              address: clientData.address,
              city: clientData.city,
              postal_code: clientData.postalCode,
              country: clientData.country,
              project_type: clientData.projectType,
              technologies: clientData.technologies,
              budget: clientData.budget,
              start_date: clientData.startDate,
              end_date: clientData.endDate,
              status: clientData.status,
              progress: clientData.progress,
              notes: clientData.notes,
              website: clientData.website,
              logo: clientData.logo,
              priority: clientData.priority,
              deadline: clientData.deadline,
              attachments: JSON.stringify(clientData.attachments || []),
              todos: JSON.stringify(clientData.todos || []),
              created_at: clientData.createdAt,
              updated_at: clientData.updatedAt
            }
            await trx.table('clients').insert(dataToInsert)
          }
        }

        // Import des photos IA (avec IDs originaux)
        if (importData.data.aiPhotos && Array.isArray(importData.data.aiPhotos)) {
          for (const photoData of importData.data.aiPhotos) {
            const dataToInsert = {
              id: photoData.id,
              name: photoData.name,
              image_prompt: photoData.imagePrompt,
              video_prompt: photoData.videoPrompt,
              image_url: photoData.imageUrl,
              created_at: photoData.createdAt,
              updated_at: photoData.updatedAt
            }
            await trx.table('ai_photos').insert(dataToInsert)
          }
        }

        // Import des abonnements (avec IDs originaux)
        if (importData.data.subscriptions && Array.isArray(importData.data.subscriptions)) {
          for (const subData of importData.data.subscriptions) {
            const dataToInsert = {
              id: subData.id,
              client_id: subData.clientId,
              service_name: subData.serviceName,
              provider: subData.provider,
              cost: subData.cost,
              billing_cycle: subData.billingCycle,
              start_date: subData.startDate,
              end_date: subData.endDate,
              status: subData.status,
              auto_renew: subData.autoRenew,
              notes: subData.notes,
              created_at: subData.createdAt,
              updated_at: subData.updatedAt
            }
            await trx.table('subscriptions').insert(dataToInsert)
          }
        }

        // Import des événements (avec IDs originaux)
        if (importData.data.events && Array.isArray(importData.data.events)) {
          for (const eventData of importData.data.events) {
            const dataToInsert = {
              id: eventData.id,
              title: eventData.title,
              start: eventData.start,
              end: eventData.end,
              background_color: eventData.backgroundColor,
              border_color: eventData.borderColor,
              client: eventData.client,
              type: eventData.type,
              description: eventData.description,
              all_day: eventData.allDay,
              created_at: eventData.createdAt,
              updated_at: eventData.updatedAt
            }
            await trx.table('events').insert(dataToInsert)
          }
        }

        // Import des prompts (avec IDs originaux)
        if (importData.data.prompts && Array.isArray(importData.data.prompts)) {
          for (const promptData of importData.data.prompts) {
            const dataToInsert = {
              id: promptData.id,
              title: promptData.title,
              category: promptData.category,
              content: promptData.content,
              created_at: promptData.createdAt,
              updated_at: promptData.updatedAt
            }
            await trx.table('prompts').insert(dataToInsert)
          }
        }

        // Import des paramètres (mise à jour ou création)
        if (importData.data.settings && Array.isArray(importData.data.settings)) {
          for (const settingData of importData.data.settings) {
            const existing = await trx.from('settings').where('key', settingData.key).first()
            const dataToInsert = {
              id: settingData.id,
              key: settingData.key,
              value: settingData.value,
              type: settingData.type,
              description: settingData.description,
              created_at: settingData.createdAt,
              updated_at: settingData.updatedAt
            }
            if (existing) {
              await trx.from('settings').where('key', settingData.key).update({
                value: settingData.value,
                type: settingData.type,
                description: settingData.description,
                updated_at: settingData.updatedAt
              })
            } else {
              await trx.table('settings').insert(dataToInsert)
            }
          }
        }

        // Réinitialiser les séquences d'auto-incrémentation
        const maxIds = await Promise.all([
          trx.from('clients').max('id as max').first(),
          trx.from('ai_photos').max('id as max').first(),
          trx.from('subscriptions').max('id as max').first(),
          trx.from('events').max('id as max').first(),
          trx.from('prompts').max('id as max').first(),
          trx.from('settings').max('id as max').first(),
        ])

        const sequences = [
          { table: 'clients', max: maxIds[0]?.max || 0 },
          { table: 'ai_photos', max: maxIds[1]?.max || 0 },
          { table: 'subscriptions', max: maxIds[2]?.max || 0 },
          { table: 'events', max: maxIds[3]?.max || 0 },
          { table: 'prompts', max: maxIds[4]?.max || 0 },
          { table: 'settings', max: maxIds[5]?.max || 0 },
        ]

        for (const seq of sequences) {
          if (seq.max > 0) {
            // Utiliser des paramètres pour éviter l'injection SQL
            await trx.raw('SELECT setval(?, ?)', [`${seq.table}_id_seq`, seq.max])
          }
        }

        await trx.commit()
        

        return response.ok({ 
          message: 'Import réussi',
          imported: {
            clients: importData.data.clients?.length || 0,
            aiPhotos: importData.data.aiPhotos?.length || 0,
            subscriptions: importData.data.subscriptions?.length || 0,
            events: importData.data.events?.length || 0,
            prompts: importData.data.prompts?.length || 0,
            settings: importData.data.settings?.length || 0,
          }
        })
      } catch (error) {
        await trx.rollback()
        throw error
      }
    } catch (error) {
      return response.badRequest({
        message: 'Erreur lors de l\'import'
      })
    }
  }

  /**
   * Obtenir la liste des tables exportables
   */
  async getTables({ response }: HttpContext) {
    try {
      const tables = [
        { name: 'clients', label: 'Clients', count: await Client.query().count('* as total').first() },
        { name: 'ai_photos', label: 'Images IA', count: await AiPhoto.query().count('* as total').first() },
        { name: 'subscriptions', label: 'Abonnements', count: await Subscription.query().count('* as total').first() },
        { name: 'events', label: 'Événements', count: await Event.query().count('* as total').first() },
        { name: 'prompts', label: 'Bibliothèque Prompts', count: await Prompt.query().count('* as total').first() },
      ]

      return response.ok(tables.map(t => ({
        ...t,
        count: t.count?.$extras?.total || 0
      })))
    } catch (error) {
      return response.internalServerError({
        message: 'Erreur lors de la récupération des tables'
      })
    }
  }
}
