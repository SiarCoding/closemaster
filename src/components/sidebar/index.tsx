import React from 'react'
import { Home, LayoutDashboard, Users, Calendar, Settings } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="w-20 bg-indigo-600 text-white p-4 flex flex-col items-center h-screen">
      <div className="mb-8">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 font-bold">
          L
        </div>
      </div>
      <nav className="flex-1 flex flex-col items-center space-y-4">
        <button className="p-2 rounded-lg bg-indigo-700"><Home size={24} /></button>
        <button className="p-2 rounded-lg hover:bg-indigo-700"><LayoutDashboard size={24} /></button>
        <button className="p-2 rounded-lg hover:bg-indigo-700"><Users size={24} /></button>
        <button className="p-2 rounded-lg hover:bg-indigo-700"><Calendar size={24} /></button>
      </nav>
      <button className="mt-auto p-2 rounded-lg hover:bg-indigo-700"><Settings size={24} /></button>
    </aside>
  )
}