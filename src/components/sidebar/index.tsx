import { Home, Users, Calendar, BarChart2, Layers, Wrench, Sliders, Settings, MessageCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: 'Dashboard' },
  { icon: MessageCircle, label: 'Gespräche' },
  { icon: BarChart2, label: 'Vertriebsanalyse' },
  { icon: Sliders, label: 'Coaching' },
  { icon: Layers, label: 'Workflows' },
  { icon: Wrench, label: 'Integration' },
  { icon: Users, label: 'Kunden' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-blue-600 text-white p-6 flex flex-col justify-between h-screen">
      <div>
        <div className="mb-8">
          <div className="w-full h-12 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold">
            CLOSEMASTER
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={cn(
                "flex items-center w-full p-2 text-left space-x-3 rounded-lg hover:bg-blue-500 transition-colors",
                index === 0 && "bg-blue-500 text-white"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <button className="flex items-center p-2 space-x-3 rounded-lg hover:bg-blue-500 transition-colors">
        <Settings size={20} />
        <span>Einstellungen</span>
      </button>
    </aside>
  );
}
