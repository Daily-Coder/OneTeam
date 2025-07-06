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
import { Calendar, Clock, User, FileText, CalendarDays, RefreshCw, Plus, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDurationColor = (duration: string) => {
    switch (duration.toLowerCase()) {
      case 'half-day':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'full-day':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'multiple-days':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const handleCancel = (): void => {
    setLeaveData({
      leaveDate: '',
      leaveDuration: '',
      title: '',
      duration: ''
    });
    setIsDialogOpen(false);
  };

  const refreshLeaves = async () => {
    const instance = firestoreConfig.getInstance();
    try {
      const docSnap = await getDocs(query(collection(instance.getDb(), 'Leaves'), where('employee_user_id', '==', user?.uid)));
      const temp: DocumentData[] = []
      docSnap.docs.map(doc => temp.push({ id: doc.id, ...doc.data() }))
      setMyLeaves(temp)
    } catch (err) {
      console.log("error while refreshing leaves", err)
    }
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
  },[])

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <Card className="w-full max-w-2xl mx-auto shadow-md border-0 bg-white">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <CalendarDays className="w-8 h-8" />
            Leave Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Request Time Off</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Submit your leave request for approval. Our team will review and respond to your request promptly.
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  <Plus className="w-5 h-5 mr-2" />
                  Apply for Leave
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    Request Leave
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Please fill in the details below to submit your leave request.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="leaveDate" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Leave Date
                      </label>
                      <Input
                        id="leaveDate"
                        name="leaveDate"
                        type="date"
                        value={leaveData.leaveDate}
                        onChange={handleInputChange}
                        required
                        className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="leaveDuration" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        Leave Duration
                      </label>
                      <select
                        id="leaveDuration"
                        name="leaveDuration"
                        value={leaveData.leaveDuration}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10 rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:ring-blue-500 focus-visible:outline-none"
                      >
                        <option value="">Select duration</option>
                        <option value="half-day">Half Day</option>
                        <option value="full-day">Full Day</option>
                        <option value="multiple-days">Multiple Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
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
                      className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="duration" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
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
                      className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <DialogFooter className="pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={processing}
                    >
                      {processing ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Leave History Section */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <CalendarDays className="w-6 h-6 text-blue-600" />
              My Leave History
            </h2>
            <p className="text-gray-600 mt-1">Track all your leave requests and their status</p>
          </div>
          <Button 
            onClick={refreshLeaves} 
            variant="outline" 
            size="sm"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {!leavesFetched ? (
            <Card className="w-full shadow-md border-0 bg-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                  <span className="ml-3 text-gray-600">Loading your leave history...</span>
                </div>
              </CardContent>
            </Card>
          ) : myLeaves.length === 0 ? (
            <Card className="w-full shadow-md border-0 bg-white">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Leave Requests</h3>
                  <p className="text-gray-600">You haven't submitted any leave requests yet.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            myLeaves.map((leave) => (
              <Card key={leave.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {leave.title}
                      </h3>
                      <p className="text-blue-100 text-sm">Leave Request</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getDurationColor(leave.leave_duration)}`}>
                        {leave.leave_duration}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                        {getStatusIcon(leave.status)}
                        <span className="ml-1">{leave.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  {/* Duration */}
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Duration</p>
                      <p className="font-semibold text-gray-800">{leave.number_of_days} days</p>
                    </div>
                  </div>

                  {/* Employee ID */}
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-medium">Employee ID</p>
                      <p className="font-semibold text-gray-800">{leave.employee_id}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-purple-600 font-medium">Leave Date</p>
                        <p className="font-semibold text-gray-800">
                          {leave.leave_date instanceof Date ? 
                            leave.leave_date.toLocaleDateString() : 
                            leave.leave_date.toDate().toLocaleDateString()
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-amber-600 font-medium">Created</p>
                        <p className="font-semibold text-gray-800">
                          {leave.created_at instanceof Date ? 
                            leave.created_at.toLocaleDateString() : 
                            leave.created_at.toDate().toLocaleDateString()
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
