'use client';

import { firestoreConfig } from "@/config/firestoreConfig";
import { useAuth } from "@/context/authContext";
import { useUser } from "@/context/userContext";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function CheckInOut() {
  const [processing, setProcessing] = useState({
    checkIn: false,
    checkOut: false
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [stats, setStats] = useState({
    checkedIn: false,
    checkedOut: false
  })

  const { user } = useAuth();
  const { userDetails } = useUser();


  async function checkIn() {
    if (processing.checkIn === true) return;
    setProcessing(prev => ({ ...prev, checkIn: true }))
    const instance = firestoreConfig.getInstance()
    try {
      console.log("pocess start")
      await addDoc(collection(instance.getDb(), `Users/${user?.uid}/activity`), {
        activity_title: 'check-in',
        activity_type: 'work-hour-logs',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        employee_id: userDetails?.employee_id
      })
      setStats(prev => ({ ...prev, checkedIn: true }))
    }
    catch (err) {
      console.log("error while checking in", err)
    }
    finally {
      setProcessing(prev => ({ ...prev, checkIn: false }))
    }
  }
  async function checkOut() {
    if (processing.checkIn) return;
    setProcessing(prev => ({ ...prev, checkIn: true }))
    const instance = firestoreConfig.getInstance()
    try {
      await addDoc(collection(instance.getDb(), `Users/${user?.uid}/activity`), {
        activity_title: 'check-out',
        activity_type: 'work-hour-logs',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        employee_id: userDetails?.employee_id
      })
      setStats(prev=>({...prev,checkedOut:true}))
    }
    catch (err) {
      console.log("error while checking in", err)
    }
    finally{
      setProcessing(prev => ({ ...prev, checkIn: false }))
    }
  }


  useEffect(() => {
    (async () => {
      try {
        const start = new Date()
        start.setHours(0, 0, 0, 0);
        const now = new Date()
        const instance = firestoreConfig.getInstance();
        const docSnap = await getDocs(query(collection(instance.getDb(), `Users/${user?.uid}/activity`), where('activity_title', '==', 'check-in'), where('created_at', '>=', start), where('created_at', '<=', now)));
        if (docSnap.docs.length > 0) {
          setStats(prev => ({ ...prev, checkedIn: true }))
        }
        const checkOutSnap = await getDocs(query(collection(instance.getDb(), `Users/${user?.uid}/activity`), where('activity_title', '==', 'check-out'), where('created_at', '>=', start)))
        if (checkOutSnap.docs.length > 0) {
          setStats(prev => ({ ...prev, checkedOut: true }))
        }
        setLoading(false)
      }
      catch(err){
        console.log("error while fetching employee matrix",err)
      }
    })()
  },[])


  return (
    <div>
    </div>
  );
}