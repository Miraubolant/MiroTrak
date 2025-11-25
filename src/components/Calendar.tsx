import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { eventsAPI, type CalendarEvent as APICalendarEvent } from '../services/api'
import EventDetailModal from './EventDetailModal'
import '../styles/calendar.css'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  extendedProps?: {
    client?: string
    type?: string
    description?: string
  }
}

interface CalendarProps {
  events?: CalendarEvent[]
  onEventClick?: (info: any) => void
  onDateClick?: (info: any) => void
  onEventDrop?: (info: any) => void
  isEventModalOpen?: boolean
  onOpenEventModal?: () => void
  onCloseEventModal?: () => void
}

function Calendar({ events = [], onEventClick, onDateClick, onEventDrop, isEventModalOpen = false, onOpenEventModal, onCloseEventModal }: CalendarProps) {
  const [eventFormData, setEventFormData] = useState({
    title: '',
    start: '',
    end: '',
    client: '',
    type: 'Réunion',
    description: '',
    backgroundColor: '#58a6ff'
  })

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Charger les événements depuis l'API
  useEffect(() => {
    loadEvents()
  }, [])

  // Gérer la touche Escape pour fermer la modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEventModalOpen && onCloseEventModal) {
          onCloseEventModal()
        }
        if (isDetailModalOpen) {
          setIsDetailModalOpen(false)
        }
      }
    }

    if (isEventModalOpen || isDetailModalOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isEventModalOpen, isDetailModalOpen, onCloseEventModal])

  const loadEvents = async () => {
    try {
      setIsLoading(true)
      const data = await eventsAPI.getAll()
      const formattedEvents: CalendarEvent[] = data.map(event => ({
        id: event.id!.toString(),
        title: event.title,
        start: event.start,
        end: event.end || undefined,
        backgroundColor: event.backgroundColor || '#58a6ff',
        borderColor: event.borderColor || '#58a6ff',
        extendedProps: {
          client: event.client || undefined,
          type: event.type || undefined,
          description: event.description || undefined
        }
      }))
      setCalendarEvents(formattedEvents)
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event)
    setIsDetailModalOpen(true)
    
    if (onEventClick) {
      onEventClick(clickInfo)
    }
  }

  const handleDateClick = (arg: any) => {
    if (onDateClick) {
      onDateClick(arg)
    }
  }

  const handleEventDrop = async (info: any) => {
    try {
      const eventId = parseInt(info.event.id)
      await eventsAPI.update(eventId, {
        start: info.event.start.toISOString(),
        end: info.event.end ? info.event.end.toISOString() : null
      })
      await loadEvents()
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error)
      info.revert() // Annuler le déplacement en cas d'erreur
    }
    
    if (onEventDrop) {
      onEventDrop(info)
    }
  }

  const handleEventResize = async (info: any) => {
    try {
      const eventId = parseInt(info.event.id)
      await eventsAPI.update(eventId, {
        start: info.event.start.toISOString(),
        end: info.event.end ? info.event.end.toISOString() : null
      })
      await loadEvents()
    } catch (error) {
      console.error('Erreur lors du redimensionnement de l\'événement:', error)
      info.revert() // Annuler le redimensionnement en cas d'erreur
    }
  }

  const handleDateSelect = (selectInfo: any) => {
    // Pré-remplir le formulaire avec les dates sélectionnées et ouvrir la modale
    setEventFormData({
      title: '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      client: '',
      type: 'Réunion',
      description: '',
      backgroundColor: '#58a6ff'
    })
    if (onOpenEventModal) {
      onOpenEventModal()
    }
    selectInfo.view.calendar.unselect()
  }

  const handleAddEvent = () => {
    setEventFormData({
      title: '',
      start: '',
      end: '',
      client: '',
      type: 'Réunion',
      description: '',
      backgroundColor: '#58a6ff'
    })
    if (onOpenEventModal) {
      onOpenEventModal()
    }
  }

  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEventFormData(prev => ({ ...prev, [name]: value }))

    // Changer la couleur en fonction du type
    if (name === 'type') {
      const colors: { [key: string]: string } = {
        'Réunion': '#58a6ff',
        'Livraison': '#3fb950',
        'Deadline': '#f85149',
        'Review': '#d29922',
        'Formation': '#a371f7'
      }
      setEventFormData(prev => ({ ...prev, backgroundColor: colors[value] || '#58a6ff' }))
    }
  }

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const eventData = {
        title: eventFormData.title,
        start: eventFormData.start,
        end: eventFormData.end || null,
        backgroundColor: eventFormData.backgroundColor,
        borderColor: eventFormData.backgroundColor,
        client: eventFormData.client || null,
        type: eventFormData.type || null,
        description: eventFormData.description || null,
        allDay: false
      }

      await eventsAPI.create(eventData)
      await loadEvents() // Recharger les événements
      
      if (onCloseEventModal) {
        onCloseEventModal()
      }
      
      // Réinitialiser le formulaire
      setEventFormData({
        title: '',
        start: '',
        end: '',
        client: '',
        type: 'Réunion',
        description: '',
        backgroundColor: '#58a6ff'
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'événement:', error)
    }
  }

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next',
          center: '',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        buttonText={{
          today: '⦿',
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
          list: 'Liste'
        }}
        locale="fr"
        firstDay={1}
        events={calendarEvents}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        select={handleDateSelect}
        eventResizableFromStart={true}
        height="auto"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
        allDayText="Journée"
        noEventsText="Aucun événement à afficher"
        eventDisplay="block"
        displayEventTime={true}
        displayEventEnd={false}
      />

      {/* Modal d'ajout d'événement */}
      {isEventModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }} onClick={() => onCloseEventModal && onCloseEventModal()}>
          <div style={{
            background: '#161b22',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            border: '1px solid #30363d',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                color: '#c9d1d9',
                fontSize: '20px',
                fontWeight: 600,
                margin: 0
              }}>
                Nouvel événement
              </h3>
              <button
                onClick={() => onCloseEventModal && onCloseEventModal()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                  Titre de l'événement *
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventFormData.title}
                  onChange={handleEventFormChange}
                  required
                  placeholder="Ex: Réunion avec le client"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                  Type d'événement *
                </label>
                <select
                  name="type"
                  value={eventFormData.type}
                  onChange={handleEventFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Réunion">Réunion</option>
                  <option value="Livraison">Livraison</option>
                  <option value="Deadline">Deadline</option>
                  <option value="Review">Review</option>
                  <option value="Formation">Formation</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                  Client
                </label>
                <input
                  type="text"
                  name="client"
                  value={eventFormData.client}
                  onChange={handleEventFormChange}
                  placeholder="Nom du client"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                    Date/Heure de début *
                  </label>
                  <input
                    type="datetime-local"
                    name="start"
                    value={eventFormData.start}
                    onChange={handleEventFormChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d1117',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      color: '#c9d1d9',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                    Date/Heure de fin
                  </label>
                  <input
                    type="datetime-local"
                    name="end"
                    value={eventFormData.end}
                    onChange={handleEventFormChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#0d1117',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      color: '#c9d1d9',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#8b949e', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={eventFormData.description}
                  onChange={handleEventFormChange}
                  placeholder="Détails de l'événement..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                paddingTop: '12px',
                borderTop: '1px solid #30363d'
              }}>
                <button
                  type="button"
                  onClick={() => onCloseEventModal && onCloseEventModal()}
                  style={{
                    padding: '10px 20px',
                    background: '#21262d',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#c9d1d9',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#30363d'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#21262d'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: '#21262d',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#e6edf3',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
                    e.currentTarget.style.background = '#30363d'
                    e.currentTarget.style.borderColor = '#484f58'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.background = '#21262d'
                    e.currentTarget.style.borderColor = '#30363d'
                  }}
                >
                  Ajouter l'événement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de détails d'événement */}
      {isDetailModalOpen && selectedEvent && (
        <EventDetailModal
          event={{
            title: selectedEvent.title,
            start: selectedEvent.start,
            end: selectedEvent.end,
            backgroundColor: selectedEvent.backgroundColor,
            extendedProps: selectedEvent.extendedProps
          }}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedEvent(null)
          }}
          onEdit={() => {
            // Pré-remplir le formulaire avec les données de l'événement
            setEventFormData({
              title: selectedEvent.title,
              start: selectedEvent.start.toISOString().slice(0, 16),
              end: selectedEvent.end ? selectedEvent.end.toISOString().slice(0, 16) : '',
              client: selectedEvent.extendedProps?.client || '',
              type: selectedEvent.extendedProps?.type || 'Réunion',
              description: selectedEvent.extendedProps?.description || '',
              backgroundColor: selectedEvent.backgroundColor || '#58a6ff'
            })
            setIsDetailModalOpen(false)
            if (onOpenEventModal) {
              onOpenEventModal()
            }
          }}
          onDelete={async () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
              try {
                const eventId = parseInt(selectedEvent.id)
                await eventsAPI.delete(eventId)
                await loadEvents()
                setIsDetailModalOpen(false)
                setSelectedEvent(null)
              } catch (error) {
                console.error('Erreur lors de la suppression de l\'événement:', error)
                alert('Erreur lors de la suppression de l\'événement')
              }
            }
          }}
        />
      )}
    </div>
  )
}

export default Calendar
