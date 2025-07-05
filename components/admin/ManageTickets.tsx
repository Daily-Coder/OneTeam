'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Pencil, Trash } from 'lucide-react';

type Ticket = {
  id: number;
  title: string;
  description: string;
};

export default function ManageTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 1, title: 'Laptop Not Booting', description: 'Device shuts down immediately.' },
    { id: 2, title: 'VPN Access Request', description: 'Need access to internal tools remotely.' },
  ]);

  const [form, setForm] = useState({ title: '', description: '' });
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const handleSave = () => {
    if (editingTicket) {
      // Update existing ticket
      setTickets((prev) =>
        prev.map((t) =>
          t.id === editingTicket.id ? { ...t, ...form } : t
        )
      );
    } else {
      // Add new ticket
      const newTicket: Ticket = {
        id: Date.now(),
        title: form.title,
        description: form.description,
      };
      setTickets((prev) => [...prev, newTicket]);
    }

    setForm({ title: '', description: '' });
    setEditingTicket(null);
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setForm({ title: ticket.title, description: ticket.description });
  };

  const handleDelete = (id: number) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="min-h-screen w-full bg-muted p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Tickets</h1>
      </div>

      {/* Ticket List */}
      {tickets.length === 0 ? (
        <div className="text-center mt-20 text-muted-foreground text-lg">
          No tickets to display. Click "Create Ticket" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{ticket.title}</p>
                    <p className="text-sm text-muted-foreground">{ticket.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(ticket)}
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Ticket</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Ticket Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                          />
                          <Textarea
                            placeholder="Ticket Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                          />
                        </div>
                        <DialogFooter>
                          <Button onClick={handleSave}>Update</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(ticket.id)}
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
