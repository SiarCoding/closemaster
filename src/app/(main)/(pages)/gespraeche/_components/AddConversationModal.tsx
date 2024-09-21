"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from 'lucide-react';

export function AddConversationModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    date: '',
    time: '',
    duration: '',
    callType: '',
    tags: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Gespräch hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gespräch hinzufügen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customer">Unternehmensname</Label>
            <Input id="customer" name="customer" value={formData.customer} onChange={handleInputChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Datum</Label>
              <Input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="time">Uhrzeit</Label>
              <Input type="time" id="time" name="time" value={formData.time} onChange={handleInputChange} required />
            </div>
          </div>
          <div>
            <Label htmlFor="duration">Dauer (Minuten)</Label>
            <Input type="number" id="duration" name="duration" value={formData.duration} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="callType">Gesprächsart</Label>
            <Select name="callType" onValueChange={(value) => handleSelectChange('callType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Wählen Sie eine Gesprächsart" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Quali Call">Quali Call</SelectItem>
                <SelectItem value="Erstgespräch">Erstgespräch</SelectItem>
                <SelectItem value="Close-Call">Close-Call</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Tags durch Kommas trennen" />
          </div>
          <div>
            <Label htmlFor="notes">Notizen/Zusammenfassung</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} />
          </div>
          <Button type="submit">Speichern</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}