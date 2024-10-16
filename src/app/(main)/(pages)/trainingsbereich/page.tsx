"use client"

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import KanbanBoard from './_components/KananBoard'
import { Loader2 } from 'lucide-react'

interface Ticket {
  id: number;
  name: string;
  company: string;
  industry: string;
  behavior: string;
  status: string;
  terminationProbability: number;
}

export default function Trainingsbereich() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      if (!response.ok) {
        throw new Error('Failed to fetch tickets')
      }
      const data = await response.json()
      setTickets(data.tickets)
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast({
        title: "Fehler",
        description: "Tickets konnten nicht geladen werden.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateTickets = async () => {
    if (!prompt) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie ein Kundenszenario ein.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/generateAITickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate tickets')
      }

      const data = await response.json()
      setTickets(prevTickets => [...prevTickets, ...data.tickets])
    } catch (error) {
      console.error('Error generating tickets:', error)
      toast({
        title: "Fehler",
        description: "Tickets konnten nicht generiert werden.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Trainingsboard</h1>
      <div className="flex space-x-4 mb-6">
        <Input
          placeholder="Geben Sie ein Kundenszenario ein..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow bg-white"
        />
        <Button onClick={handleGenerateTickets} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generiere...
            </>
          ) : (
            'Tickets generieren'
          )}
        </Button>
      </div>
      <KanbanBoard tickets={tickets} setTickets={setTickets} />
    </div>
  )
}