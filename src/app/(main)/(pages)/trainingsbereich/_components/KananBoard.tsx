import React from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import TicketCard from './TicketCard'

interface Ticket {
  id: number;
  name: string;
  company: string;
  industry: string;
  behavior: string;
  status: string;
  terminationProbability: number;
}

interface KanbanBoardProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const columns = [
  { id: 'kaltakquise', title: 'Kaltakquise' },
  { id: 'qualiCall', title: 'Quali-Call' },
  { id: 'salesCall', title: 'Sales-Call' },
  { id: 'abgeschlossen', title: 'Abgeschlossen' },
]

export default function KanbanBoard({ tickets, setTickets }: KanbanBoardProps) {
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const newTickets = Array.from(tickets)
    const [reorderedItem] = newTickets.splice(result.source.index, 1)
    reorderedItem.status = result.destination.droppableId
    newTickets.splice(result.destination.index, 0, reorderedItem)

    setTickets(newTickets)

    try {
      await fetch(`/api/tickets/${reorderedItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: reorderedItem.status }),
      })
    } catch (error) {
      console.error('Error updating ticket status:', error)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-wrap -mx-2">
        {columns.map((column) => (
          <div key={column.id} className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
            <h2 className="font-semibold mb-4">{column.title}</h2>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-4 rounded-lg min-h-[300px]"
                >
                  {tickets
                    .filter((ticket) => ticket.status === column.id)
                    .map((ticket, index) => (
                      <Draggable key={ticket.id} draggableId={ticket.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TicketCard ticket={ticket} setTickets={setTickets} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}