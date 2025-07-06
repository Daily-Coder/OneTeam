'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentData } from "firebase-admin/firestore";
import { FilePlus, CheckCircle, ListChecks } from "lucide-react";
import { useState,useEffect } from "react";
import { firestoreConfig } from "@/config/firestoreConfig";
import { getDocs,query,collection,where } from "firebase/firestore";
import { useUser } from "@/context/userContext";

export default function ManageApplications() {


  const [myApplications, setMyApplications] = useState<DocumentData[]>([]);
  const [applicationsFetched, setApplicationsFetched] = useState<boolean>(false);
  const {userDetails}=useUser();
  
  useEffect(() => {
    (async () => {
      const instance = firestoreConfig.getInstance();
      try {
        const docSnap = await getDocs(query(collection(instance.getDb(), 'Leaves'), where('organization_name', '==', userDetails?.organization_name)));
        const temp: DocumentData[] = []
        docSnap.docs.map(doc => temp.push({ id: doc.id, ...doc.data() }));
        setMyApplications(temp)
        setApplicationsFetched(true)
      }
      catch (err) {
        console.log("error while fetching applications", err);
      }
    })()
  }, [])
  return (
    !applicationsFetched ? <main className="w-full h-full flex items-center justify-center">Fetching your records...</main> :
    <main className="min-h-screen w-full bg-muted p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Applications</h1>
      </div>

      {/* Applications Summary */}
      <div className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
        <FilePlus className="h-5 w-5" />
        Applications Summary
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Applications</p>
            <p className="text-xl font-bold text-foreground">{myApplications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Applications</p>
            <p className="text-xl font-bold text-yellow-500">{myApplications.filter(a=>a.status==='pending').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Resolved Applications</p>
            <p className="text-xl font-bold text-green-600">{myApplications.filter(a=>a.status!='pending').length}</p>
          </CardContent>
        </Card>
      </div>

      
    </main>
  );
}
