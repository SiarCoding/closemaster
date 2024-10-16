import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Play } from 'lucide-react'
import Link from 'next/link'

interface Ticket {
  id: number;
  name: string;
  company: string;
  industry: string;
  behavior: string;
  status: string;
  terminationProbability: number;
}

interface TicketCardProps {
  ticket: Ticket;
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

export default function TicketCard({ ticket, setTickets }: TicketCardProps) {
  const handleDelete = async () => {
    try {
      await fetch(`/api/tickets/${ticket.id}`, {
        method: 'DELETE',
      })
      setTickets(prevTickets => prevTickets.filter(t => t.id !== ticket.id))
    } catch (error) {
      console.error('Error deleting ticket:', error)
    }
  }

  return (
    <Card className="mb-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-4">
            <Avatar className="bg-blue-500">
              <AvatarFallback>{ticket.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-800">{ticket.name}</h3>
              <p className="text-sm text-gray-500">{ticket.company}</p>
              <p className="text-sm text-gray-500">{ticket.industry}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
            {ticket.terminationProbability}%
          </Badge>
          <span className="text-sm text-gray-600">Terminierungswahrscheinlichkeit</span>
        </div>
        <p className="text-sm font-medium text-gray-700">{ticket.behavior}</p>
        <div className="mt-4 flex justify-end">
          <Link href={`/trainingsbereich/rollenspiel/${ticket.id}`}>
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              <Play className="h-4 w-4 mr-2" />
              Starten
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}