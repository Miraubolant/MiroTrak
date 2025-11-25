import axios from 'axios'

const API_URL = 'http://localhost:3333/api'

export interface DatabaseTable {
  name: string
  label: string
  count: number
}

export interface ImportResult {
  message: string
  imported: {
    clients: number
    aiPhotos: number
    subscriptions: number
    events: number
    prompts: number
    settings: number
  }
}

export const databaseAPI = {
  // Récupérer la liste des tables
  getTables: async (): Promise<DatabaseTable[]> => {
    const response = await axios.get(`${API_URL}/database/tables`)
    return response.data
  },

  // Exporter toute la base en JSON
  exportJson: async (): Promise<void> => {
    const response = await axios.get(`${API_URL}/database/export/json`, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `database-export-${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  // Exporter une table en CSV
  exportCsv: async (table: string): Promise<void> => {
    const response = await axios.get(`${API_URL}/database/export/csv/${table}`, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${table}-export-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  // Exporter une table en Excel
  exportExcel: async (table: string): Promise<void> => {
    const response = await axios.get(`${API_URL}/database/export/excel/${table}`, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${table}-export-${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  // Importer depuis un fichier JSON
  importJson: async (file: File): Promise<ImportResult> => {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string
          const data = JSON.parse(content)
          const response = await axios.post(`${API_URL}/database/import/json`, data)
          resolve(response.data)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'))
      reader.readAsText(file)
    })
  }
}
