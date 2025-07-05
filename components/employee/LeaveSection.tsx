'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
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
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setLeaveData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Leave request submitted:', leaveData);
    // Here you would typically send the data to your backend
    alert('Leave request submitted successfully!');
    
    // Reset form and close dialog
    setLeaveData({
      leaveDate: '',
      leaveDuration: '',
      title: '',
      duration: ''
    });
    setIsDialogOpen(false);
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
                      Submit Request
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
