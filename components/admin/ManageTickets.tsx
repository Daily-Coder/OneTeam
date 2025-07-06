'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { firestoreConfig } from '@/config/firestoreConfig';
import { collection, getDocs, query, where, DocumentData, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useUser } from '@/context/userContext';

export default function ManageTickets() {
  const { userDetails } = useUser();
  const [myTickets, setMyTickets] = useState<DocumentData[]>([]);
  const [ticketsFetched, setTicketsFetched] = useState(false);


  async function markTicketAsResolved(id:string) {
    const instance=firestoreConfig.getInstance()
    try{
      console.log("process started")
      await updateDoc(doc(collection(instance.getDb(),'Tickets'),id),{
        status:'resolved',
        updated_at:serverTimestamp()
      })
      const updatedTickets=myTickets.map(t=>{
        if(t.id===id){
          return {
            ...t,
            status:'resolved',
          }
        }
        return t
      })
      setMyTickets(updatedTickets)
      console.log('process ended')
    }
    catch(err){
      console.log("error while marking as resolved",err)
    }
  }
  useEffect(() => {
    (async () => {
      try {
        const instance = firestoreConfig.getInstance();
        const q = query(
          collection(instance.getDb(), 'Tickets'),
          where('organization_name', '==', userDetails?.organization_name)
        );

        const snap = await getDocs(q);
        const temp: DocumentData[] = [];
        snap.docs.forEach((doc) => temp.push({ id: doc.id, ...doc.data() }));
        setMyTickets(temp);
      } catch (err) {
        console.error('Error fetching tickets:', err);
      } finally {
        setTicketsFetched(true);
      }
    })();
  }, [userDetails]);

  const statusColor: Record<string, string> = {
    open: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
    'in‑progress': 'bg-blue-100 text-blue-700',
  };

  const priorityColor: Record<string, string> = {
    Low: 'bg-gray-100 text-gray-600',
    Medium: 'bg-yellow-100 text-yellow-600',
    High: 'bg-orange-100 text-orange-600',
    Critical: 'bg-red-100 text-red-600',
  };

  const formatDate = (ts?:any) =>
    ts?.toDate().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });



  return (
    <main className="h-screen overflow-hidden bg-muted p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Tickets Overview</h1>
      </header>

      {!ticketsFetched ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="h-40 bg-gray-100 rounded-lg" />
            </Card>
          ))}
        </div>
      ) : myTickets.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-lg text-gray-500 text-center">
            No tickets found for this organization.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
          {myTickets.map((ticket) => {
            const status = ticket.status?.toLowerCase() || 'open';

            return (
              <Card
                key={ticket.id}
                className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3
                      className="font-semibold text-lg text-gray-800 truncate max-w-[85%]"
                      title={ticket.title}
                    >
                      {ticket.title}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColor[status]}`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColor[
                        ticket.priority || 'Low'
                      ]}`}
                    >
                      {ticket.priority}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                      {ticket.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3">{ticket.description}</p>

                  <div className="text-xs text-gray-500 flex flex-wrap gap-x-4">
                    <span>Created: {formatDate(ticket.created_at)}</span>
                    <span>Updated: {formatDate(ticket.updated_at)}</span>
                  </div>

                  {status === 'resolved' ? (
                    <div className="flex items-center justify-center text-green-700 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolved
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 text-green-600 hover:bg-green-50 w-full justify-center cursor-pointer"
                      onClick={()=>markTicketAsResolved(ticket.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark as Resolved
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
