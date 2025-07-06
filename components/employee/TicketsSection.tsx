'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { firestoreConfig } from '@/config/firestoreConfig';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { useAuth } from '@/context/authContext';
import { useUser } from '@/context/userContext';
import { DocumentData } from 'firebase-admin/firestore';

interface TicketData {
  title: string;
  description: string;
  priority: string;
  category: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function TicketsSection(): React.JSX.Element {
  const [ticketData, setTicketData] = useState<TicketData>({
    title: '',
    description: '',
    priority: '',
    category: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { user } = useAuth()
  const { userDetails } = useUser();

  const [myTicets, setMyTickets] = useState<DocumentData[]>([]);
  const [ticketsFetched, setTicketsFetched] = useState<boolean>(false)
  // Mock data for previous tickets - replace with actual API calls
  const [previousTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: 'Software Installation Request',
      description: 'Need help installing new development tools on my machine',
      priority: 'Medium',
      category: 'IT Support',
      status: 'In Progress',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16'
    },
    {
      id: '2',
      title: 'Access Permission Issue',
      description: 'Cannot access the shared drive for project files',
      priority: 'High',
      category: 'Access Management',
      status: 'Resolved',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12'
    },
    {
      id: '3',
      title: 'Email Configuration',
      description: 'Email client not syncing properly with company server',
      priority: 'Low',
      category: 'IT Support',
      status: 'Open',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-18'
    }
  ]);
  const [processing, setProcessing] = useState<boolean>(false)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setTicketData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (processing) return;
    setProcessing(true)
    const instance = firestoreConfig.getInstance()
    try {
      const payload = {
        employee_id: userDetails?.employee_id,
        employee_user_id: user?.uid,
        title: ticketData.title,
        description: ticketData.description,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        status: 'open',
        category: ticketData.category,
        priority: ticketData.priority,
        organization_name: userDetails?.organization_name
      }
      const newDoc = await addDoc(collection(instance.getDb(), 'Tickets'), payload)
      const newPayload = {
        ...payload,
        created_at: new Date(),
        updated_at: new Date()
      }
      setMyTickets(prev => ([{ id: newDoc.id, ...newPayload }, ...prev]))
      setTicketData(prev => ({
        ...prev,
        title: '',
        description: '',
        priority: '',
        category: ''
      }))
      setIsDialogOpen(false)
    }
    catch (err) {
      console.log("error while raising a new ticket", err)
    }
    finally {
      setProcessing(false)
    }
  };

  const handleCancel = (): void => {
    // Reset form and close dialog
    setTicketData({
      title: '',
      description: '',
      priority: '',
      category: ''
    });
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-red-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  useEffect(() => {
    (async () => {
      const instance = firestoreConfig.getInstance()
      try {
        const docSnap = await getDocs(query(collection(instance.getDb(), 'Tickets'), where('organization_name', '==', userDetails?.organization_name), where('employee_user_id', '==', user?.uid)));
        console.log(docSnap.docs.length)
        const temp: DocumentData[] = []
        docSnap.docs.map(doc => temp.push({ id: doc.id, ...doc.data() }))
        setMyTickets(temp)
        setTicketsFetched(true)
      }
      catch (err) {
        console.log("error while fetching tickets", err)
      }
    })()
  }, [])
  return (
    <div className="space-y-6">
      {/* Raise Ticket Section */}
          <p className='px-2 pt-10 text-xl font-bold text-blue-700'>Ticket Management</p>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Raise a new support ticket or request assistance. Click the button below to create a ticket.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg cursor-pointer">
                  Raise New Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-blue-700">
                    Create New Ticket
                  </DialogTitle>
                  <DialogDescription>
                    Please provide the details below to create your support ticket.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Ticket Title
                    </label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter a brief title for your ticket"
                      value={ticketData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Provide detailed description of your issue or request"
                      value={ticketData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={ticketData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select category</option>
                        <option value="IT Support">IT Support</option>
                        <option value="Access Management">Access Management</option>
                        <option value="Software Issues">Software Issues</option>
                        <option value="Hardware Issues">Hardware Issues</option>
                        <option value="Network Issues">Network Issues</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="priority" className="text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={ticketData.priority}
                        onChange={handleInputChange}
                        required
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {
                        processing ? `Submitting...` : `Submit Ticket`
                      }
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>


      {/* Previous Tickets Section */}
          <p className='px-2 pt-10 text-xl font-bold text-blue-700'>My Past Tickets</p>
          <div className="space-y-4">
            {!ticketsFetched ? <p className="text-center text-gray-500 py-8"> Getting your data</p> : 
            
            myTicets.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No previous tickets found.</p>
            ) : (
              myTicets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-900">{ticket.title}</h3>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3">{ticket.description}</p>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {ticket.category}
                    </span>
                    <div className="flex gap-4">
                      <span>Created: {ticket.created_at instanceof Date ? ticket.created_at.toLocaleDateString():ticket.created_at.toDate().toLocaleDateString()}</span>
                      <span>Updated: {ticket.created_at instanceof Date ? ticket.created_at.toLocaleDateString():ticket.created_at.toDate().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

    </div>
  );
}
