import { Bell, Calendar, Mail, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Infobar() {
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">@Deine Firma</h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Calendar className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mail className="h-5 w-5 text-gray-500" />
          </Button>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors">
            <Avatar>
              <AvatarImage src="/mann.jpg" alt="Max Mustermann" />
              <AvatarFallback>MM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-gray-800">Max Mustermann</span>
              <span className="text-xs text-gray-500">Sales-Manager</span>
            </div>
            <ChevronDown size={16} className="text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
