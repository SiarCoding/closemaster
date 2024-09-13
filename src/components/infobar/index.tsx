import React from 'react'
import { Bell, Calendar, ChevronDown, Mail } from 'lucide-react'

export default function Infobar() {
  return (
    <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow">
      <div>
        <h1 className="text-2xl font-bold">Good morning, Jason Ranti</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 bg-gray-100 rounded-full shadow"><Calendar size={20} /></button>
        <button className="p-2 bg-gray-100 rounded-full shadow"><Bell size={20} /></button>
        <button className="p-2 bg-gray-100 rounded-full shadow"><Mail size={20} /></button>
        <button className="flex items-center space-x-2 bg-gray-100 rounded-full shadow px-3 py-2">
          <img src="/placeholder.svg?height=32&width=32" alt="Profile" className="w-8 h-8 rounded-full" />
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  )
}