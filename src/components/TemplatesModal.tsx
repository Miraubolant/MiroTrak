import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import { templatesAPI, emailTemplatesAPI, PdfTemplates, EmailTemplates } from '../services/api'
import '../styles/modal.css'

interface TemplatesModalProps {
  isOpen: boolean
  onClose: () => void
  clientData?: any
}

function TemplatesModal({ isOpen, onClose, clientData }: TemplatesModalProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates'>('generate')
  const [selectedDocType, setSelectedDocType] = useState<string>('devis')
  const [pdfTemplates, setPdfTemplates] = useState<PdfTemplates>({})
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplates>({})
  const [editingTemplateType, setEditingTemplateType] = useState<string>('')
  const [editingTemplateContent, setEditingTemplateContent] = useState<string>('')
  const [editingTemplateName, setEditingTemplateName] = useState<string>('')
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>('')

  // Charger les templates au montage
  useEffect(() => {
    if (isOpen) {
      loadTemplates()
      loadEmailTemplates()
    }
  }, [isOpen])

  // Générer le PDF quand le type de document change en mode génération
  useEffect(() => {
    if (isOpen && activeTab === 'generate' && clientData && pdfTemplates[selectedDocType]) {
      generatePdfPreview()
    }
  }, [isOpen, activeTab, selectedDocType, clientData, pdfTemplates])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const loadTemplates = async () => {
    try {
      const templates = await templatesAPI.getAll()
      setPdfTemplates(templates)
      if (Object.keys(templates).length > 0 && !selectedDocType) {
        setSelectedDocType(Object.keys(templates)[0])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des templates:', error)
    }
  }

  const loadEmailTemplates = async () => {
    try {
      const templates = await emailTemplatesAPI.getAll()
      setEmailTemplates(templates)
    } catch (error) {
      console.error('Erreur lors du chargement des templates email:', error)
    }
  }

  const replaceVariables = (template: string, data: any): string => {
    if (!data) return template

    // Calculs pour les variables spéciales
    const budgetValue = parseFloat(data.budget) || 0
    const budgetTVA = (budgetValue * 0.2).toFixed(2)
    const budgetTTC = (budgetValue * 1.2).toFixed(2)
    const currentDate = new Date().toLocaleDateString('fr-FR')
    const currentTime = new Date().toLocaleTimeString('fr-FR')
    const documentNumber = Date.now().toString().slice(-8)

    const variables: { [key: string]: string } = {
      '{{clientName}}': data.clientName || '',
      '{{contactPerson}}': data.contactPerson || '',
      '{{email}}': data.email || '',
      '{{phone}}': data.phone || '',
      '{{company}}': data.company || '',
      '{{address}}': data.address || '',
      '{{city}}': data.city || '',
      '{{postalCode}}': data.postalCode || '',
      '{{country}}': data.country || '',
      '{{projectType}}': data.projectType || '',
      '{{technologies}}': data.technologies || '',
      '{{budget}}': budgetValue.toLocaleString() || '',
      '{{budgetTVA}}': budgetTVA || '',
      '{{budgetTTC}}': budgetTTC || '',
      '{{startDate}}': data.startDate || '',
      '{{endDate}}': data.endDate || '',
      '{{status}}': data.status || '',
      '{{progress}}': data.progress || '0',
      '{{notes}}': data.notes || '',
      '{{website}}': data.website || '',
      '{{currentDate}}': currentDate,
      '{{currentTime}}': currentTime,
      '{{documentNumber}}': documentNumber,
    }

    let result = template
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(key, 'g'), value)
    })

    return result
  }

  const generatePdfPreview = () => {
    if (!clientData || !pdfTemplates[selectedDocType]) return

    const doc = new jsPDF()
    const template = pdfTemplates[selectedDocType]
    const content = replaceVariables(template.content, clientData)

    // Couleurs professionnelles
    const primaryColor = [30, 58, 138] // Bleu marine professionnel
    const accentColor = [59, 130, 246] // Bleu clair
    const secondaryColor = [31, 41, 55] // Gris anthracite
    const lightGray = [243, 244, 246]
    const borderColor = [209, 213, 219]

    // En-tête moderne avec dégradé simulé
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, 210, 35, 'F')
    
    // Bande accent
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2])
    doc.rect(0, 35, 210, 2, 'F')

    // Logo/Nom entreprise
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('MiroTrak', 15, 15)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Solutions Digitales & Développement Web', 15, 22)
    doc.setFontSize(8)
    doc.text('SIRET: 123 456 789 00012 | TVA: FR12345678900', 15, 28)

    // Informations document à droite
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`${template.name.toUpperCase()}`, 195, 13, { align: 'right' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const docNumber = `N° ${Date.now().toString().slice(-8)}`
    doc.text(docNumber, 195, 19, { align: 'right' })
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 195, 25, { align: 'right' })
    
    // Date de validité (30 jours)
    const validityDate = new Date()
    validityDate.setDate(validityDate.getDate() + 30)
    doc.text(`Valide jusqu'au: ${validityDate.toLocaleDateString('fr-FR')}`, 195, 31, { align: 'right' })

    // Reset couleur texte
    doc.setTextColor(0, 0, 0)

    // Bloc informations client (encadré)
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
    doc.roundedRect(15, 45, 85, 35, 2, 2, 'F')
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
    doc.setLineWidth(0.5)
    doc.roundedRect(15, 45, 85, 35, 2, 2)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('CLIENT', 18, 50)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(clientData.clientName || '', 18, 56)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    if (clientData.contactPerson) doc.text(`Att: ${clientData.contactPerson}`, 18, 62)
    if (clientData.company) doc.text(clientData.company, 18, 67)
    if (clientData.email) doc.text(clientData.email, 18, 72)
    if (clientData.phone) doc.text(clientData.phone, 18, 77)

    // Bloc informations prestataire (encadré)
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
    doc.roundedRect(110, 45, 85, 35, 2, 2, 'F')
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
    doc.roundedRect(110, 45, 85, 35, 2, 2)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('PRESTATAIRE', 113, 50)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('MiroTrak - Victor Mirault', 113, 56)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Développeur Web Full-Stack', 113, 62)
    doc.text('123 Avenue de la République', 113, 67)
    doc.text('75011 Paris, France', 113, 72)
    doc.text('contact@mirotrak.com | +33 6 12 34 56 78', 113, 77)

    // Titre du document
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text(template.name.toUpperCase(), 105, 92, { align: 'center' })

    // Ligne de séparation élégante
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(1)
    doc.line(15, 97, 195, 97)

    // Parser et formater le contenu
    const lines = content.split('\n')
    let yPosition = 107
    const lineHeight = 6
    const pageHeight = 260 // Ajusté pour le footer étendu

    lines.forEach((line) => {
      // Vérifier si on dépasse la page
      if (yPosition > pageHeight) {
        doc.addPage()
        yPosition = 20
      }

      // Détecter les sections (lignes avec ━)
      if (line.includes('━━━')) {
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
        doc.setLineWidth(0.5)
        doc.line(15, yPosition - 2, 195, yPosition - 2)
        yPosition += 4
        return
      }

      // Détecter les titres de section (en majuscules)
      if (line.trim() === line.trim().toUpperCase() && line.trim().length > 0 && line.trim().length < 50 && !line.includes(':')) {
        // Fond coloré pour les titres
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
        doc.rect(15, yPosition - 4, 180, 8, 'F')
        
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text(line.trim(), 17, yPosition + 1)
        yPosition += lineHeight + 4
        return
      }

      // Détecter les lignes avec montants
      if (line.includes('Total') || line.includes('TVA') || line.includes('€')) {
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])

        // Séparer label et valeur
        const parts = line.split(':')
        if (parts.length === 2) {
          // Fond léger pour les totaux
          if (line.includes('Total TTC') || line.includes('TOTAL TTC')) {
            doc.setFillColor(accentColor[0], accentColor[1], accentColor[2])
            doc.setTextColor(255, 255, 255)
            doc.rect(15, yPosition - 4, 180, 8, 'F')
          } else if (line.includes('Total')) {
            doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
            doc.rect(15, yPosition - 4, 180, 8, 'F')
          }
          
          doc.text(parts[0].trim() + ':', 17, yPosition)
          doc.text(parts[1].trim(), 193, yPosition, { align: 'right' })
        } else {
          doc.text(line.trim(), 15, yPosition)
        }
        yPosition += lineHeight + 2
        return
      }

      // Lignes normales
      if (line.trim().length > 0) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(0, 0, 0)

        // Wrapper le texte si trop long
        const wrappedLines = doc.splitTextToSize(line.trim(), 175)
        wrappedLines.forEach((wrappedLine: string) => {
          if (yPosition > pageHeight) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(wrappedLine, 15, yPosition)
          yPosition += lineHeight
        })
      } else {
        yPosition += lineHeight / 2
      }
    })

    // Ajouter les mentions légales sur la dernière page
    const pageCount = doc.getNumberOfPages()
    doc.setPage(pageCount)
    
    // Vérifier si on a assez d'espace pour les mentions légales
    if (yPosition > 220) {
      doc.addPage()
      yPosition = 20
    } else {
      yPosition += 15
    }

    // Titre mentions légales
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(0.5)
    doc.line(15, yPosition, 195, yPosition)
    yPosition += 6
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('MENTIONS LÉGALES ET CONDITIONS', 15, yPosition)
    yPosition += 7

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)

    const legalMentions = [
      'Conditions de paiement : 50% à la commande, 50% à la livraison. Paiement par virement bancaire sous 30 jours.',
      'TVA : TVA non applicable, art. 293 B du CGI (auto-entrepreneur) ou TVA à 20% selon statut.',
      'Pénalités de retard : En cas de retard de paiement, des pénalités égales à 3 fois le taux d\'intérêt légal seront appliquées.',
      'Indemnité forfaitaire : Une indemnité forfaitaire de 40€ pour frais de recouvrement sera exigée (art. L441-6 du Code de Commerce).',
      'Propriété intellectuelle : Les livrables restent la propriété de MiroTrak jusqu\'au paiement intégral.',
      'Garantie : Garantie de 3 mois sur les bugs et dysfonctionnements. Maintenance évolutive sur devis.',
      'Annulation : Toute annulation doit être notifiée par écrit. L\'acompte reste acquis en cas d\'annulation client.',
      'Juridiction : Tout litige sera soumis aux tribunaux compétents de Paris, France.',
      '',
      'Ce document constitue un engagement contractuel. En signant ce devis, le client accepte les conditions générales',
      'de vente disponibles sur notre site web et reconnaît avoir pris connaissance de l\'ensemble des clauses.'
    ]

    legalMentions.forEach((mention) => {
      if (yPosition > 285) {
        doc.addPage()
        yPosition = 20
      }
      const wrappedLines = doc.splitTextToSize(mention, 180)
      wrappedLines.forEach((line: string) => {
        doc.text(line, 15, yPosition)
        yPosition += 4
      })
    })

    // Bloc signature (si devis ou contrat)
    if (selectedDocType === 'devis' || selectedDocType === 'contrat') {
      const finalPageCount = doc.getNumberOfPages()
      doc.setPage(finalPageCount)
      
      if (yPosition > 240) {
        doc.addPage()
        yPosition = 20
      } else {
        yPosition += 10
      }

      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
      doc.setLineWidth(0.5)
      
      // Cadre signature client
      doc.rect(15, yPosition, 85, 30)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Signature du client', 18, yPosition + 5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.text('Précédée de "Bon pour accord"', 18, yPosition + 10)
      doc.text('Date et signature :', 18, yPosition + 15)
      
      // Cadre signature prestataire
      doc.rect(110, yPosition, 85, 30)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Signature MiroTrak', 113, yPosition + 5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.text('Victor Mirault', 113, yPosition + 10)
      doc.text('Gérant', 113, yPosition + 15)
    }

    // Pied de page professionnel
    const finalPageCount = doc.getNumberOfPages()
    for (let i = 1; i <= finalPageCount; i++) {
      doc.setPage(i)
      
      // Ligne supérieure du footer
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
      doc.setLineWidth(0.3)
      doc.line(15, 282, 195, 282)
      
      // Informations footer
      doc.setFontSize(7)
      doc.setTextColor(100, 100, 100)
      doc.setFont('helvetica', 'normal')
      
      // Gauche
      doc.text('MiroTrak - Victor Mirault', 15, 287)
      doc.text('SIRET: 123 456 789 00012', 15, 291)
      
      // Centre
      doc.text(`${template.name.toUpperCase()} ${docNumber}`, 105, 287, { align: 'center' })
      doc.text(`Page ${i} / ${finalPageCount}`, 105, 291, { align: 'center' })
      
      // Droite
      doc.text('contact@mirotrak.com', 195, 287, { align: 'right' })
      doc.text('+33 6 12 34 56 78', 195, 291, { align: 'right' })
    }

    // Générer le blob URL pour l'aperçu
    const pdfBlob = doc.output('blob')
    const blobUrl = URL.createObjectURL(pdfBlob)
    setPdfBlobUrl(blobUrl)
  }

  const downloadPDF = () => {
    if (!clientData || !pdfTemplates[selectedDocType]) return

    const doc = new jsPDF()
    const template = pdfTemplates[selectedDocType]
    const content = replaceVariables(template.content, clientData)

    // Couleurs professionnelles
    const primaryColor = [30, 58, 138] // Bleu marine professionnel
    const accentColor = [59, 130, 246] // Bleu clair
    const secondaryColor = [31, 41, 55] // Gris anthracite
    const lightGray = [243, 244, 246]
    const borderColor = [209, 213, 219]

    // En-tête moderne avec dégradé simulé
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, 210, 35, 'F')
    
    // Bande accent
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2])
    doc.rect(0, 35, 210, 2, 'F')

    // Logo/Nom entreprise
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('MiroTrak', 15, 15)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Solutions Digitales & Développement Web', 15, 22)
    doc.setFontSize(8)
    doc.text('SIRET: 123 456 789 00012 | TVA: FR12345678900', 15, 28)

    // Informations document à droite
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`${template.name.toUpperCase()}`, 195, 13, { align: 'right' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const docNumber = `N° ${Date.now().toString().slice(-8)}`
    doc.text(docNumber, 195, 19, { align: 'right' })
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 195, 25, { align: 'right' })
    
    // Date de validité (30 jours)
    const validityDate = new Date()
    validityDate.setDate(validityDate.getDate() + 30)
    doc.text(`Valide jusqu'au: ${validityDate.toLocaleDateString('fr-FR')}`, 195, 31, { align: 'right' })

    // Reset couleur texte
    doc.setTextColor(0, 0, 0)

    // Bloc informations client (encadré)
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
    doc.roundedRect(15, 45, 85, 35, 2, 2, 'F')
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
    doc.setLineWidth(0.5)
    doc.roundedRect(15, 45, 85, 35, 2, 2)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('CLIENT', 18, 50)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(clientData.clientName || '', 18, 56)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    if (clientData.contactPerson) doc.text(`Att: ${clientData.contactPerson}`, 18, 62)
    if (clientData.company) doc.text(clientData.company, 18, 67)
    if (clientData.email) doc.text(clientData.email, 18, 72)
    if (clientData.phone) doc.text(clientData.phone, 18, 77)

    // Bloc informations prestataire (encadré)
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
    doc.roundedRect(110, 45, 85, 35, 2, 2, 'F')
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
    doc.roundedRect(110, 45, 85, 35, 2, 2)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('PRESTATAIRE', 113, 50)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('MiroTrak - Victor Mirault', 113, 56)
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Développeur Web Full-Stack', 113, 62)
    doc.text('123 Avenue de la République', 113, 67)
    doc.text('75011 Paris, France', 113, 72)
    doc.text('contact@mirotrak.com | +33 6 12 34 56 78', 113, 77)

    // Titre du document
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text(template.name.toUpperCase(), 105, 92, { align: 'center' })

    // Ligne de séparation élégante
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(1)
    doc.line(15, 97, 195, 97)

    // Parser et formater le contenu
    const lines = content.split('\n')
    let yPosition = 107
    const lineHeight = 6
    const pageHeight = 260 // Ajusté pour le footer étendu

    lines.forEach((line) => {
      // Vérifier si on dépasse la page
      if (yPosition > pageHeight) {
        doc.addPage()
        yPosition = 20
      }

      // Détecter les sections (lignes avec ━)
      if (line.includes('━━━')) {
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
        doc.setLineWidth(0.5)
        doc.line(15, yPosition - 2, 195, yPosition - 2)
        yPosition += 4
        return
      }

      // Détecter les titres de section (en majuscules)
      if (line.trim() === line.trim().toUpperCase() && line.trim().length > 0 && line.trim().length < 50 && !line.includes(':')) {
        // Fond coloré pour les titres
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
        doc.rect(15, yPosition - 4, 180, 8, 'F')
        
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text(line.trim(), 17, yPosition + 1)
        yPosition += lineHeight + 4
        return
      }

      // Détecter les lignes avec montants
      if (line.includes('Total') || line.includes('TVA') || line.includes('€')) {
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])

        // Séparer label et valeur
        const parts = line.split(':')
        if (parts.length === 2) {
          // Fond léger pour les totaux
          if (line.includes('Total TTC') || line.includes('TOTAL TTC')) {
            doc.setFillColor(accentColor[0], accentColor[1], accentColor[2])
            doc.setTextColor(255, 255, 255)
            doc.rect(15, yPosition - 4, 180, 8, 'F')
          } else if (line.includes('Total')) {
            doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
            doc.rect(15, yPosition - 4, 180, 8, 'F')
          }
          
          doc.text(parts[0].trim() + ':', 17, yPosition)
          doc.text(parts[1].trim(), 193, yPosition, { align: 'right' })
        } else {
          doc.text(line.trim(), 15, yPosition)
        }
        yPosition += lineHeight + 2
        return
      }

      // Lignes normales
      if (line.trim().length > 0) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(0, 0, 0)

        // Wrapper le texte si trop long
        const wrappedLines = doc.splitTextToSize(line.trim(), 175)
        wrappedLines.forEach((wrappedLine: string) => {
          if (yPosition > pageHeight) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(wrappedLine, 15, yPosition)
          yPosition += lineHeight
        })
      } else {
        yPosition += lineHeight / 2
      }
    })

    // Ajouter les mentions légales sur la dernière page
    const pageCount = doc.getNumberOfPages()
    doc.setPage(pageCount)
    
    // Vérifier si on a assez d'espace pour les mentions légales
    if (yPosition > 220) {
      doc.addPage()
      yPosition = 20
    } else {
      yPosition += 15
    }

    // Titre mentions légales
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(0.5)
    doc.line(15, yPosition, 195, yPosition)
    yPosition += 6
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('MENTIONS LÉGALES ET CONDITIONS', 15, yPosition)
    yPosition += 7

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)

    const legalMentions = [
      'Conditions de paiement : 50% à la commande, 50% à la livraison. Paiement par virement bancaire sous 30 jours.',
      'TVA : TVA non applicable, art. 293 B du CGI (auto-entrepreneur) ou TVA à 20% selon statut.',
      'Pénalités de retard : En cas de retard de paiement, des pénalités égales à 3 fois le taux d\'intérêt légal seront appliquées.',
      'Indemnité forfaitaire : Une indemnité forfaitaire de 40€ pour frais de recouvrement sera exigée (art. L441-6 du Code de Commerce).',
      'Propriété intellectuelle : Les livrables restent la propriété de MiroTrak jusqu\'au paiement intégral.',
      'Garantie : Garantie de 3 mois sur les bugs et dysfonctionnements. Maintenance évolutive sur devis.',
      'Annulation : Toute annulation doit être notifiée par écrit. L\'acompte reste acquis en cas d\'annulation client.',
      'Juridiction : Tout litige sera soumis aux tribunaux compétents de Paris, France.',
      '',
      'Ce document constitue un engagement contractuel. En signant ce devis, le client accepte les conditions générales',
      'de vente disponibles sur notre site web et reconnaît avoir pris connaissance de l\'ensemble des clauses.'
    ]

    legalMentions.forEach((mention) => {
      if (yPosition > 285) {
        doc.addPage()
        yPosition = 20
      }
      const wrappedLines = doc.splitTextToSize(mention, 180)
      wrappedLines.forEach((line: string) => {
        doc.text(line, 15, yPosition)
        yPosition += 4
      })
    })

    // Bloc signature (si devis ou contrat)
    if (selectedDocType === 'devis' || selectedDocType === 'contrat') {
      const finalPageCount = doc.getNumberOfPages()
      doc.setPage(finalPageCount)
      
      if (yPosition > 240) {
        doc.addPage()
        yPosition = 20
      } else {
        yPosition += 10
      }

      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
      doc.setLineWidth(0.5)
      
      // Cadre signature client
      doc.rect(15, yPosition, 85, 30)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Signature du client', 18, yPosition + 5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.text('Précédée de "Bon pour accord"', 18, yPosition + 10)
      doc.text('Date et signature :', 18, yPosition + 15)
      
      // Cadre signature prestataire
      doc.rect(110, yPosition, 85, 30)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Signature MiroTrak', 113, yPosition + 5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.text('Victor Mirault', 113, yPosition + 10)
      doc.text('Gérant', 113, yPosition + 15)
    }

    // Pied de page professionnel
    const finalPageCount = doc.getNumberOfPages()
    for (let i = 1; i <= finalPageCount; i++) {
      doc.setPage(i)
      
      // Ligne supérieure du footer
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
      doc.setLineWidth(0.3)
      doc.line(15, 282, 195, 282)
      
      // Informations footer
      doc.setFontSize(7)
      doc.setTextColor(100, 100, 100)
      doc.setFont('helvetica', 'normal')
      
      // Gauche
      doc.text('MiroTrak - Victor Mirault', 15, 287)
      doc.text('SIRET: 123 456 789 00012', 15, 291)
      
      // Centre
      doc.text(`${template.name.toUpperCase()} ${docNumber}`, 105, 287, { align: 'center' })
      doc.text(`Page ${i} / ${finalPageCount}`, 105, 291, { align: 'center' })
      
      // Droite
      doc.text('contact@mirotrak.com', 195, 287, { align: 'right' })
      doc.text('+33 6 12 34 56 78', 195, 291, { align: 'right' })
    }

    // Télécharger
    const filename = `${selectedDocType}_${clientData.clientName.replace(/\s+/g, '_')}_${Date.now()}.pdf`
    doc.save(filename)
  }

  const sendEmail = () => {
    if (!clientData || !emailTemplates[selectedDocType]) return

    const emailTemplate = emailTemplates[selectedDocType]
    const subject = replaceVariables(emailTemplate.subject, clientData)
    let body = replaceVariables(emailTemplate.body, clientData)

    // Remplacer le symbole euro
    body = body.replace(/€/g, 'euros')
    const cleanSubject = subject.replace(/€/g, 'euros')

    // Générer le PDF
    const doc = new jsPDF()
    const template = pdfTemplates[selectedDocType]
    const content = replaceVariables(template.content, clientData)

    // [Copier tout le code de génération PDF depuis downloadPDF]
    // Couleurs professionnelles
    const primaryColor = [30, 58, 138]
    const accentColor = [59, 130, 246]
    const secondaryColor = [31, 41, 55]
    const lightGray = [243, 244, 246]
    const borderColor = [209, 213, 219]

    // En-tête moderne
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, 210, 35, 'F')
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2])
    doc.rect(0, 35, 210, 2, 'F')

    // Logo/Nom entreprise
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('MiroTrak', 15, 15)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Solutions Digitales & Développement Web', 15, 22)
    doc.setFontSize(8)
    doc.text('SIRET: 123 456 789 00012 | TVA: FR12345678900', 15, 28)

    // Informations document
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`${template.name.toUpperCase()}`, 195, 13, { align: 'right' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const docNumber = `N° ${Date.now().toString().slice(-8)}`
    doc.text(docNumber, 195, 19, { align: 'right' })
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 195, 25, { align: 'right' })
    const validityDate = new Date()
    validityDate.setDate(validityDate.getDate() + 30)
    doc.text(`Valide jusqu'au: ${validityDate.toLocaleDateString('fr-FR')}`, 195, 31, { align: 'right' })

    doc.setTextColor(0, 0, 0)

    // Blocs client et prestataire
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
    doc.roundedRect(15, 45, 85, 35, 2, 2, 'F')
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
    doc.setLineWidth(0.5)
    doc.roundedRect(15, 45, 85, 35, 2, 2)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('CLIENT', 18, 50)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(clientData.clientName || '', 18, 56)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    if (clientData.contactPerson) doc.text(`Att: ${clientData.contactPerson}`, 18, 62)
    if (clientData.company) doc.text(clientData.company, 18, 67)
    if (clientData.email) doc.text(clientData.email, 18, 72)
    if (clientData.phone) doc.text(clientData.phone, 18, 77)

    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
    doc.roundedRect(110, 45, 85, 35, 2, 2, 'F')
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
    doc.roundedRect(110, 45, 85, 35, 2, 2)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('PRESTATAIRE', 113, 50)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('MiroTrak - Victor Mirault', 113, 56)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Développeur Web Full-Stack', 113, 62)
    doc.text('123 Avenue de la République', 113, 67)
    doc.text('75011 Paris, France', 113, 72)
    doc.text('contact@mirotrak.com | +33 6 12 34 56 78', 113, 77)

    // Titre
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text(template.name.toUpperCase(), 105, 92, { align: 'center' })
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(1)
    doc.line(15, 97, 195, 97)

    // Contenu
    const lines = content.split('\n')
    let yPosition = 107
    const lineHeight = 6
    const pageHeight = 260

    lines.forEach((line) => {
      if (yPosition > pageHeight) {
        doc.addPage()
        yPosition = 20
      }

      if (line.includes('━━━')) {
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
        doc.setLineWidth(0.5)
        doc.line(15, yPosition - 2, 195, yPosition - 2)
        yPosition += 4
        return
      }

      if (line.trim() === line.trim().toUpperCase() && line.trim().length > 0 && line.trim().length < 50 && !line.includes(':')) {
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
        doc.rect(15, yPosition - 4, 180, 8, 'F')
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text(line.trim(), 17, yPosition + 1)
        yPosition += lineHeight + 4
        return
      }

      if (line.includes('Total') || line.includes('TVA') || line.includes('€')) {
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
        const parts = line.split(':')
        if (parts.length === 2) {
          if (line.includes('Total TTC') || line.includes('TOTAL TTC')) {
            doc.setFillColor(accentColor[0], accentColor[1], accentColor[2])
            doc.setTextColor(255, 255, 255)
            doc.rect(15, yPosition - 4, 180, 8, 'F')
          } else if (line.includes('Total')) {
            doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
            doc.rect(15, yPosition - 4, 180, 8, 'F')
          }
          doc.text(parts[0].trim() + ':', 17, yPosition)
          doc.text(parts[1].trim(), 193, yPosition, { align: 'right' })
        } else {
          doc.text(line.trim(), 15, yPosition)
        }
        yPosition += lineHeight + 2
        return
      }

      if (line.trim().length > 0) {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(0, 0, 0)
        const wrappedLines = doc.splitTextToSize(line.trim(), 175)
        wrappedLines.forEach((wrappedLine: string) => {
          if (yPosition > pageHeight) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(wrappedLine, 15, yPosition)
          yPosition += lineHeight
        })
      } else {
        yPosition += lineHeight / 2
      }
    })

    // Mentions légales
    const pageCount = doc.getNumberOfPages()
    doc.setPage(pageCount)
    if (yPosition > 220) {
      doc.addPage()
      yPosition = 20
    } else {
      yPosition += 15
    }

    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(0.5)
    doc.line(15, yPosition, 195, yPosition)
    yPosition += 6
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('MENTIONS LÉGALES ET CONDITIONS', 15, yPosition)
    yPosition += 7
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)

    const legalMentions = [
      'Conditions de paiement : 50% à la commande, 50% à la livraison. Paiement par virement bancaire sous 30 jours.',
      'TVA : TVA non applicable, art. 293 B du CGI (auto-entrepreneur) ou TVA à 20% selon statut.',
      'Pénalités de retard : En cas de retard de paiement, des pénalités égales à 3 fois le taux d\'intérêt légal seront appliquées.',
      'Indemnité forfaitaire : Une indemnité forfaitaire de 40€ pour frais de recouvrement sera exigée (art. L441-6 du Code de Commerce).',
      'Propriété intellectuelle : Les livrables restent la propriété de MiroTrak jusqu\'au paiement intégral.',
      'Garantie : Garantie de 3 mois sur les bugs et dysfonctionnements. Maintenance évolutive sur devis.',
      'Annulation : Toute annulation doit être notifiée par écrit. L\'acompte reste acquis en cas d\'annulation client.',
      'Juridiction : Tout litige sera soumis aux tribunaux compétents de Paris, France.',
      '',
      'Ce document constitue un engagement contractuel. En signant ce devis, le client accepte les conditions générales',
      'de vente disponibles sur notre site web et reconnaît avoir pris connaissance de l\'ensemble des clauses.'
    ]

    legalMentions.forEach((mention) => {
      if (yPosition > 285) {
        doc.addPage()
        yPosition = 20
      }
      const wrappedLines = doc.splitTextToSize(mention, 180)
      wrappedLines.forEach((line: string) => {
        doc.text(line, 15, yPosition)
        yPosition += 4
      })
    })

    // Signatures
    if (selectedDocType === 'devis' || selectedDocType === 'contrat') {
      const finalPageCount = doc.getNumberOfPages()
      doc.setPage(finalPageCount)
      if (yPosition > 240) {
        doc.addPage()
        yPosition = 20
      } else {
        yPosition += 10
      }
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
      doc.setLineWidth(0.5)
      doc.rect(15, yPosition, 85, 30)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Signature du client', 18, yPosition + 5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.text('Précédée de "Bon pour accord"', 18, yPosition + 10)
      doc.text('Date et signature :', 18, yPosition + 15)
      doc.rect(110, yPosition, 85, 30)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('Signature MiroTrak', 113, yPosition + 5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.text('Victor Mirault', 113, yPosition + 10)
      doc.text('Gérant', 113, yPosition + 15)
    }

    // Footer
    const finalPageCount = doc.getNumberOfPages()
    for (let i = 1; i <= finalPageCount; i++) {
      doc.setPage(i)
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
      doc.setLineWidth(0.3)
      doc.line(15, 282, 195, 282)
      doc.setFontSize(7)
      doc.setTextColor(100, 100, 100)
      doc.setFont('helvetica', 'normal')
      doc.text('MiroTrak - Victor Mirault', 15, 287)
      doc.text('SIRET: 123 456 789 00012', 15, 291)
      doc.text(`${template.name.toUpperCase()} ${docNumber}`, 105, 287, { align: 'center' })
      doc.text(`Page ${i} / ${finalPageCount}`, 105, 291, { align: 'center' })
      doc.text('contact@mirotrak.com', 195, 287, { align: 'right' })
      doc.text('+33 6 12 34 56 78', 195, 291, { align: 'right' })
    }

    // Convertir le PDF et le télécharger
    const filename = `${selectedDocType}_${clientData.clientName.replace(/\s+/g, '_')}_${Date.now()}.pdf`

    // Message indiquant comment joindre le PDF
    const attachmentNote = `\n\n---\nNote: Le PDF a été téléchargé automatiquement. Veuillez le joindre manuellement à cet email avant l'envoi.\nNom du fichier: ${filename}`

    // Télécharger le PDF automatiquement
    doc.save(filename)

    // Ouvrir le client email
    // Note: mailto ne supporte pas les pièces jointes pour des raisons de sécurité
    // L'utilisateur devra joindre le PDF manuellement
    const encodedSubject = encodeURIComponent(cleanSubject)
    const encodedBody = encodeURIComponent(body + attachmentNote)

    const mailtoLink = `mailto:${clientData.email}?subject=${encodedSubject}&body=${encodedBody}`
    
    // Petit délai pour laisser le téléchargement se terminer
    setTimeout(() => {
      window.location.href = mailtoLink
    }, 500)
  }

  const handleEditTemplate = (type: string) => {
    setEditingTemplateType(type)
    setEditingTemplateName(pdfTemplates[type].name)
    setEditingTemplateContent(pdfTemplates[type].content)
  }

  const handleSaveTemplate = async () => {
    if (!editingTemplateType) return

    try {
      const updatedTemplates = {
        ...pdfTemplates,
        [editingTemplateType]: {
          name: editingTemplateName,
          content: editingTemplateContent,
          enabled: pdfTemplates[editingTemplateType].enabled
        }
      }

      await templatesAPI.saveBulk(updatedTemplates)
      setPdfTemplates(updatedTemplates)
      setEditingTemplateType('')
      setEditingTemplateContent('')
      setEditingTemplateName('')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du template:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingTemplateType('')
    setEditingTemplateContent('')
    setEditingTemplateName('')
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-large">
        <div className="modal-header">
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Gestion des Documents
          </h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Générer
          </button>
          <button
            className={`settings-tab ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Templates
          </button>
        </div>

        {activeTab === 'generate' ? (
          !clientData ? (
            <div className="modal-form" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <svg style={{ width: '64px', height: '64px', color: '#30363d', marginBottom: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <p style={{ color: '#c9d1d9', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                Aucun client sélectionné
              </p>
              <p style={{ color: '#8b949e', fontSize: '14px' }}>
                Sélectionnez un client dans le tableau pour générer des documents
              </p>
            </div>
          ) : (
            <>
              <div style={{ padding: '16px 24px', background: '#161b22', borderBottom: '1px solid #21262d' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#c9d1d9', fontSize: '14px', fontWeight: 600 }}>
                  Type de document
                </label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {Object.entries(pdfTemplates).map(([key, template]) => (
                    <option key={key} value={key}>{template.name}</option>
                  ))}
                </select>
              </div>

              <div className="modal-form">
                <div style={{
                  background: '#0d1117',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  minHeight: '500px'
                }}>
                  {pdfBlobUrl ? (
                    <iframe
                      src={pdfBlobUrl}
                      style={{
                        width: '100%',
                        height: '500px',
                        border: 'none'
                      }}
                      title="Aperçu PDF"
                    />
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '500px',
                      color: '#8b949e'
                    }}>
                      Chargement de l'aperçu...
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={onClose}>
                  Fermer
                </button>
                <button
                  className="btn-secondary"
                  onClick={downloadPDF}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Télécharger PDF
                </button>
                <button
                  className="btn-primary"
                  onClick={sendEmail}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Envoyer par email
                </button>
              </div>
            </>
          )
        ) : (
          <>
            <div className="modal-form">
              {editingTemplateType ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#c9d1d9', fontSize: '14px', fontWeight: 600 }}>
                      Nom du template
                    </label>
                    <input
                      type="text"
                      value={editingTemplateName}
                      onChange={(e) => setEditingTemplateName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#0d1117',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        color: '#c9d1d9',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#c9d1d9', fontSize: '14px', fontWeight: 600 }}>
                      Contenu du template
                      <span style={{ color: '#8b949e', fontSize: '12px', fontWeight: 'normal', marginLeft: '8px' }}>
                        Variables: clientName, contactPerson, email, phone, projectType, technologies, budget, budgetTVA, budgetTTC, status, progress, notes, currentDate
                      </span>
                    </label>
                    <textarea
                      value={editingTemplateContent}
                      onChange={(e) => setEditingTemplateContent(e.target.value)}
                      rows={20}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#0d1117',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        color: '#c9d1d9',
                        fontSize: '13px',
                        fontFamily: "'Courier New', monospace",
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <h3 style={{ color: '#c9d1d9', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                      Templates disponibles
                    </h3>
                    <p style={{ color: '#8b949e', fontSize: '14px' }}>
                      Sélectionnez un template pour le modifier
                    </p>
                  </div>
                  {Object.entries(pdfTemplates).map(([key, template]) => (
                    <div
                      key={key}
                      style={{
                        background: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ color: '#c9d1d9', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
                          {template.name}
                        </div>
                        <div style={{ color: '#8b949e', fontSize: '13px' }}>
                          Type: {key}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditTemplate(key)}
                        style={{
                          padding: '8px 16px',
                          background: '#2d3348',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#e5e7eb',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#2d3348'}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Modifier
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              {editingTemplateType ? (
                <>
                  <button className="btn-secondary" onClick={handleCancelEdit}>
                    Annuler
                  </button>
                  <button className="btn-primary" onClick={handleSaveTemplate}>
                    Sauvegarder
                  </button>
                </>
              ) : (
                <button className="btn-secondary" onClick={onClose}>
                  Fermer
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TemplatesModal
