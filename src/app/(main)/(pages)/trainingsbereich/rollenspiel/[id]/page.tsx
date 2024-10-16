"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import ColdCallingRollenspiel from '@/app/(main)/(pages)/trainingsbereich/_components/ColdCallingRollenspiel'
import { Loader2 } from 'lucide-react'

export default function RollenspielPage() {
  const [ticketData, setTicketData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const params = useParams()

  useEffect(() => {
    fetchTicketData()
  }, [])

  const fetchTicketData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/tickets/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch ticket data')
      }
      const data = await response.json()
      setTicketData(data)
    } catch (error) {
      console.error('Error fetching ticket data:', error)
      toast({
        title: "Fehler",
        description: "Konnte Ticketdaten nicht laden.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Lade Gesprächsdaten...</p>
        </div>
      </div>
    )
  }

  if (!ticketData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-white text-lg">Keine Daten gefunden.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <ColdCallingRollenspiel ticketData={ticketData} />
    </div>
  )
}