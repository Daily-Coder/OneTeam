'use client';

import { firestoreConfig } from "@/config/firestoreConfig";
import { useAuth } from "@/context/authContext";
import { useUser } from "@/context/userContext";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogIn, LogOut, CheckCircle, AlertCircle, RefreshCw, TrendingUp, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceRecord {
  date: string;
  checkInTime: string;
  checkOutTime: string;
  checkInStatus: 'on-time' | 'late';
  checkOutStatus: 'on-time' | 'overtime';
  totalHours: number;
}

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
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  const { user } = useAuth();
  const { userDetails } = useUser();

  // Colors for charts
  const COLORS = {
    onTime: '#10B981', // Green
    late: '#EF4444',   // Red
    overtime: '#F59E0B', // Amber
    normal: '#3B82F6'  // Blue
  };

  const analyzeAttendance = (checkInTime: Date, checkOutTime?: Date) => {
    const checkInHour = checkInTime.getHours();
    const checkInMinute = checkInTime.getMinutes();
    const checkInTotalMinutes = checkInHour * 60 + checkInMinute;
    
    const onTimeThreshold = 9 * 60; // 9:00 AM in minutes
    const checkInStatus: 'on-time' | 'late' = checkInTotalMinutes <= onTimeThreshold ? 'on-time' : 'late';
    
    let checkOutStatus: 'on-time' | 'overtime' = 'on-time';
    let totalHours = 0;
    
    if (checkOutTime) {
      const checkOutHour = checkOutTime.getHours();
      const checkOutMinute = checkOutTime.getMinutes();
      const checkOutTotalMinutes = checkOutHour * 60 + checkOutMinute;
      
      // const normalEndThreshold = 17 * 60; // 5:00 PM in minutes
      const overtimeThreshold = 17.5 * 60; // 5:30 PM in minutes
      
      if (checkOutTotalMinutes > overtimeThreshold) {
        checkOutStatus = 'overtime';
      }
      
      totalHours = (checkOutTotalMinutes - checkInTotalMinutes) / 60;
    }
    
    return { checkInStatus, checkOutStatus, totalHours };
  };

  const fetchAttendanceHistory = async () => {
    try {
      const instance = firestoreConfig.getInstance();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Fetch check-in records
      const checkInQuery = query(
        collection(instance.getDb(), `Users/${user?.uid}/activity`),
        where('activity_title', '==', 'check-in'),
        where('created_at', '>=', thirtyDaysAgo)
      );
      
      const checkOutQuery = query(
        collection(instance.getDb(), `Users/${user?.uid}/activity`),
        where('activity_title', '==', 'check-out'),
        where('created_at', '>=', thirtyDaysAgo)
      );
      
      const [checkInSnap, checkOutSnap] = await Promise.all([
        getDocs(checkInQuery),
        getDocs(checkOutQuery)
      ]);
      
      const checkInRecords = checkInSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().created_at.toDate().toDateString(),
        time: doc.data().created_at.toDate()
      }));
      
      const checkOutRecords = checkOutSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().created_at.toDate().toDateString(),
        time: doc.data().created_at.toDate()
      }));
      
      // Group by date and analyze
      const attendanceMap = new Map<string, AttendanceRecord>();
      
      checkInRecords.forEach(record => {
        const { checkInStatus } = analyzeAttendance(record.time);
        attendanceMap.set(record.date, {
          date: record.date,
          checkInTime: record.time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          checkOutTime: '',
          checkInStatus,
          checkOutStatus: 'on-time',
          totalHours: 0
        });
      });
      
      checkOutRecords.forEach(record => {
        const existing = attendanceMap.get(record.date);
        if (existing) {
          const { checkOutStatus, totalHours } = analyzeAttendance(new Date(record.date), record.time);
          existing.checkOutTime = record.time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          });
          existing.checkOutStatus = checkOutStatus;
          existing.totalHours = totalHours;
        }
      });
      
      const attendanceArray = Array.from(attendanceMap.values()).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setAttendanceData(attendanceArray);
      
      // Prepare chart data
      const chartData = attendanceArray.slice(-7).map(record => ({
        date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'On Time': record.checkInStatus === 'on-time' ? 1 : 0,
        'Late': record.checkInStatus === 'late' ? 1 : 0,
        'Overtime': record.checkOutStatus === 'overtime' ? 1 : 0,
        'Normal': record.checkOutStatus === 'on-time' ? 1 : 0
      }));
      
      setChartData(chartData);
      
    } catch (err) {
      console.log("error while fetching attendance history", err);
    }
  };

  async function checkIn() {
    if (processing.checkIn === true) return;
    setProcessing(prev => ({ ...prev, checkIn: true }))
    const instance = firestoreConfig.getInstance()
    try {
      console.log("process start")
      await addDoc(collection(instance.getDb(), `Users/${user?.uid}/activity`), {
        activity_title: 'check-in',
        activity_type: 'work-hour-logs',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        employee_id: userDetails?.employee_id
      })
      setStats(prev => ({ ...prev, checkedIn: true }))
      // Refresh attendance data after check-in
      await fetchAttendanceHistory();
    }
    catch (err) {
      console.log("error while checking in", err)
    }
    finally {
      setProcessing(prev => ({ ...prev, checkIn: false }))
    }
  }

  async function checkOut() {
    if (processing.checkOut) return;
    setProcessing(prev => ({ ...prev, checkOut: true }))
    const instance = firestoreConfig.getInstance()
    try {
      await addDoc(collection(instance.getDb(), `Users/${user?.uid}/activity`), {
        activity_title: 'check-out',
        activity_type: 'work-hour-logs',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        employee_id: userDetails?.employee_id
      })
      setStats(prev => ({ ...prev, checkedOut: true }))
      // Refresh attendance data after check-out
      await fetchAttendanceHistory();
    }
    catch (err) {
      console.log("error while checking out", err)
    }
    finally {
      setProcessing(prev => ({ ...prev, checkOut: false }))
    }
  }

  const refreshStatus = async () => {
    setLoading(true);
    try {
      const start = new Date()
      start.setHours(0, 0, 0, 0);
      const now = new Date()
      const instance = firestoreConfig.getInstance();
      const docSnap = await getDocs(query(collection(instance.getDb(), `Users/${user?.uid}/activity`), where('activity_title', '==', 'check-in'), where('created_at', '>=', start), where('created_at', '<=', now)));
      if (docSnap.docs.length > 0) {
        setStats(prev => ({ ...prev, checkedIn: true }))
      } else {
        setStats(prev => ({ ...prev, checkedIn: true }))
      }
      const checkOutSnap = await getDocs(query(collection(instance.getDb(), `Users/${user?.uid}/activity`), where('activity_title', '==', 'check-out'), where('created_at', '>=', start)))
      if (checkOutSnap.docs.length > 0) {
        setStats(prev => ({ ...prev, checkedOut: true }))
      } else {
        setStats(prev => ({ ...prev, checkedOut: false }))
      }
    }
    catch(err){
      console.log("error while refreshing status", err)
      setLoading(false)
    }
    finally {
      setLoading(false)
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
        
        // Fetch attendance history
        await fetchAttendanceHistory();
      }
      catch(err){
        console.log("error while fetching employee matrix",err)
        setLoading(false)
      }
    })()
  },[])

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate summary statistics
  const summaryStats = attendanceData.reduce((acc, record) => {
    if (record.checkInStatus === 'on-time') acc.onTimeCheckIns++;
    if (record.checkInStatus === 'late') acc.lateCheckIns++;
    if (record.checkOutStatus === 'overtime') acc.overtimeDays++;
    if (record.checkOutStatus === 'on-time') acc.normalCheckOuts++;
    return acc;
  }, { onTimeCheckIns: 0, lateCheckIns: 0, overtimeDays: 0, normalCheckOuts: 0 });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading attendance status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <Card className="w-full max-w-2xl mx-auto shadow-md border-0 bg-white">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Clock className="w-8 h-8" />
            Attendance Check-In/Out
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Current Time and Date */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-800">{getCurrentTime()}</div>
              <div className="text-gray-600">{getCurrentDate()}</div>
            </div>

            {/* Status Indicators */}
            <div className="flex justify-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                stats.checkedIn 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
                {stats.checkedIn ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium">
                  {stats.checkedIn ? 'Checked In' : 'Not Checked In'}
                </span>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                stats.checkedOut 
                  ? 'bg-red-50 border-red-200 text-red-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
                {stats.checkedOut ? (
                  <CheckCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium">
                  {stats.checkedOut ? 'Checked Out' : 'Not Checked Out'}
                </span>
              </div>
            </div>

            {/* Main Toggle Button */}
            <div className="space-y-4">
              {!stats.checkedIn ? (
                <Button
                  onClick={checkIn}
                  disabled={processing.checkIn}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {processing.checkIn ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                      Checking In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-6 h-6 mr-3" />
                      Check In
                    </>
                  )}
                </Button>
              ) : !stats.checkedOut ? (
                <Button
                  onClick={checkOut}
                  disabled={processing.checkOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {processing.checkOut ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                      Checking Out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-6 h-6 mr-3" />
                      Check Out
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-lg font-medium">Attendance Complete for Today</span>
                    </div>
                  </div>
                  <Button
                    onClick={refreshStatus}
                    variant="outline"
                    className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Refresh Status
                  </Button>
                </div>
              )}
            </div>

            {/* Employee Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p><strong>Employee:</strong> {userDetails?.name || 'N/A'}</p>
                <p><strong>ID:</strong> {userDetails?.employee_id || 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Analytics */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Summary Statistics */}
        <Card className="shadow-md border-0 bg-white">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Attendance Summary (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{summaryStats.onTimeCheckIns}</div>
                <div className="text-sm text-green-700">On Time Check-ins</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">{summaryStats.lateCheckIns}</div>
                <div className="text-sm text-red-700">Late Check-ins</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{summaryStats.normalCheckOuts}</div>
                <div className="text-sm text-blue-700">Normal Check-outs</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-2xl font-bold text-amber-600">{summaryStats.overtimeDays}</div>
                <div className="text-sm text-amber-700">Overtime Days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Chart */}
        <Card className="shadow-md border-0 bg-white">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              Weekly Attendance Pattern
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="On Time" fill={COLORS.onTime} stackId="a" />
                  <Bar dataKey="Late" fill={COLORS.late} stackId="a" />
                  <Bar dataKey="Overtime" fill={COLORS.overtime} stackId="b" />
                  <Bar dataKey="Normal" fill={COLORS.normal} stackId="b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.onTime }}></div>
                <span>On Time (≤9:00 AM)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.late }}></div>
                <span>Late (&gt;9:00 AM)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.overtime }}></div>
                <span>Overtime (&gt;5:30 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.normal }}></div>
                <span>Normal (≤5:00 PM)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance Records */}
        <Card className="shadow-md border-0 bg-white">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              Recent Attendance Records
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {attendanceData.slice(-7).reverse().map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-gray-600 w-24">{record.date}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Check-in: {record.checkInTime}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.checkInStatus === 'on-time' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.checkInStatus === 'on-time' ? 'On Time' : 'Late'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.checkOutTime && (
                      <>
                        <span className="text-sm">Check-out: {record.checkOutTime}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.checkOutStatus === 'overtime' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {record.checkOutStatus === 'overtime' ? 'Overtime' : 'Normal'}
                        </span>
                        <span className="text-sm text-gray-600">({record.totalHours.toFixed(1)}h)</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}