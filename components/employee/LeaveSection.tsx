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
import { useAuth } from '@/context/authContext';
import { useUser } from '@/context/userContext';
import { firestoreConfig } from '@/config/firestoreConfig';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { DocumentData } from 'firebase-admin/firestore';

interface LeaveData {
  leaveDate: string;
  leaveDuration: string;
  title: string;
  duration: string;
}

export default function LeaveSection(): React.JSX.Element {
  const [leaveData, setLeaveData] = useState<LeaveData>({
    leaveDate: '',
    leaveDuration: '',
    title: '',
    duration: ''
  });
  const [myLeaves,setMyLeaves]=useState<DocumentData[]>([])
  const [leavesFetched,setLeavesFetched]=useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [processing,setProcessing]=useState<boolean>(false)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setLeaveData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const { user } = useAuth();
  const { userDetails } = useUser();

  const handleSubmit = async(e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if(processing) return;
    setProcessing(true)
    const instance = firestoreConfig.getInstance()
    try {
      const payload={
        employee_id:userDetails?.employee_id,
        organization_name:userDetails?.organization_name,
        employee_user_id:user?.uid,
        status:'pending',
        title:leaveData.title,
        leave_duration:leaveData.leaveDuration,
        number_of_days:leaveData.duration,
        created_at:serverTimestamp(),
        updated_at:serverTimestamp(),
        leave_date:new Date(leaveData.leaveDate)
      }
      const newDoc=await addDoc(collection(instance.getDb(),'Leaves'),payload)
      const newPayload={
        ...payload,
        created_at:new Date(),
        updated_at:new Date(),
        leave_date:new Date(leaveData.leaveDate)
      }
      setMyLeaves(prev=>([{id:newDoc.id,...newPayload},...prev]))
      setLeaveData({
        leaveDate: '',
        leaveDuration: '',
        title: '',
        duration: ''
      });
      setIsDialogOpen(false);
    }
    catch (err) {
      console.log("error while creating leave", err)
    }
    finally{
      setProcessing(false)
    }
  };


  const handleCancel = (): void => {
    // Reset form and close dialog
    setLeaveData({
      leaveDate: '',
      leaveDuration: '',
      title: '',
      duration: ''
    });
    setIsDialogOpen(false);
  };


  useEffect(()=>{
    (async()=>{
      const instance=firestoreConfig.getInstance();
      try{
        const docSnap=await getDocs(query(collection(instance.getDb(),'Leaves'),where('employee_user_id','==',user?.uid)));
        const temp:DocumentData[]=[]
        docSnap.docs.map(doc=>temp.push({id:doc.id,...doc.data()}))
        setMyLeaves(temp)
        setLeavesFetched(true)
      }
      catch(err){
        console.log("error while fetching your leaves",err)
      }
    })()
  })
  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-700">
            Leave Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Submit your leave request for approval. Click the button below to apply for leave.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Apply for Leave
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-blue-700">
                    Available for Leave
                  </DialogTitle>
                  <DialogDescription>
                    Please fill in the details below to submit your leave request.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="leaveDate" className="text-sm font-medium text-gray-700">
                        Leave Date
                      </label>
                      <Input
                        id="leaveDate"
                        name="leaveDate"
                        type="date"
                        value={leaveData.leaveDate}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="leaveDuration" className="text-sm font-medium text-gray-700">
                        Leave Duration
                      </label>
                      <select
                        id="leaveDuration"
                        name="leaveDuration"
                        value={leaveData.leaveDuration}
                        onChange={handleInputChange}
                        required
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select duration</option>
                        <option value="half-day">Half Day</option>
                        <option value="full-day">Full Day</option>
                        <option value="multiple-days">Multiple Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Leave Title
                    </label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter leave title (e.g., Sick Leave, Vacation)"
                      value={leaveData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="duration" className="text-sm font-medium text-gray-700">
                      Duration (Number of Days)
                    </label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="0.5"
                      step="0.5"
                      placeholder="Enter number of days (e.g., 1, 1.5, 2)"
                      value={leaveData.duration}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
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
                        processing ? `Submitting...` : `Submit Request`
                      }
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

                        <p className='px-2 pt-10 text-xl font-bold text-blue-700'>My Past Tickets</p>
          <div className="space-y-4">
            {!leavesFetched ? <p className="text-center text-gray-500 py-8"> Getting your data</p> : 
            
            myLeaves.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No previous tickets found.</p>
            ) : (
              myLeaves.map((leave) => (
                <div key={leave.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-900">{leave.title}</h3>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium `}>
                        {leave.leave_duration}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium `}>
                        {leave.status}
                      </span>
                    </div>
                  </div>
                
                  <p className="text-gray-600 mb-3">{leave.number_of_days}</p>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {leave.employee_id}
                    </span>
                    <div className="flex gap-4">
                      <span>Created: {leave.created_at instanceof Date ? leave.created_at.toLocaleDateString():leave.created_at.toDate().toLocaleDateString()}</span>
                      <span>Updated: {leave.created_at instanceof Date ? leave.created_at.toLocaleDateString():leave.created_at.toDate().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>










    </div>
  );
}
