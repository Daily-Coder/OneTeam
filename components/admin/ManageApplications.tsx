'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentData } from "firebase-admin/firestore";
import { FilePlus, CheckCircle,  User, Calendar, Clock, RefreshCw, AlertCircle, CheckSquare, XCircle, Folder } from "lucide-react";
import { useState, useEffect } from "react";
import { firestoreConfig } from "@/config/firestoreConfig";
import { getDocs, query, collection, where, updateDoc, doc } from "firebase/firestore";
import { useUser } from "@/context/userContext";

export default function ManageApplications() {
  const [myApplications, setMyApplications] = useState<DocumentData[]>([]);
  const [applicationsFetched, setApplicationsFetched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const { userDetails } = useUser();

  const fetchApplications = async () => {
    if (!userDetails?.organization_name) {
      setError('Organization name not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const instance = firestoreConfig.getInstance();
      const docSnap = await getDocs(query(collection(instance.getDb(), 'Leaves'), where('organization_name', '==', userDetails.organization_name)));
      const temp: DocumentData[] = []
      docSnap.docs.map(doc => temp.push({ id: doc.id, ...doc.data() }));
      setMyApplications(temp);
      setApplicationsFetched(true);
    }
    catch (err) {
      console.log("error while fetching applications", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    }
    finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchApplications();
  };

  const approveApplication = async (applicationId: string) => {
    if (!userDetails?.organization_name) {
      setError('Organization name not available');
      return;
    }

    try {
      setApprovingId(applicationId);
      setError(null);
      
      const instance = firestoreConfig.getInstance();
      const applicationRef = doc(instance.getDb(), 'Leaves', applicationId);
      
      await updateDoc(applicationRef, {
        status: 'approved',
        updated_at: new Date(),
        approved_by: userDetails.email || userDetails.employee_id,
        approved_at: new Date()
      });

      // Refresh the applications list
      await fetchApplications();
    } catch (err) {
      console.log("error while approving application", err);
      setError(err instanceof Error ? err.message : 'Failed to approve application');
    } finally {
      setApprovingId(null);
    }
  };

  const rejectApplication = async (applicationId: string) => {
    if (!userDetails?.organization_name) {
      setError('Organization name not available');
      return;
    }

    try {
      setRejectingId(applicationId);
      setError(null);
      
      const instance = firestoreConfig.getInstance();
      const applicationRef = doc(instance.getDb(), 'Leaves', applicationId);
      
      await updateDoc(applicationRef, {
        status: 'rejected',
        updated_at: new Date(),
        rejected_by: userDetails.email || userDetails.employee_id,
        rejected_at: new Date()
      });

      // Refresh the applications list
      await fetchApplications();
    } catch (err) {
      console.log("error while rejecting application", err);
      setError(err instanceof Error ? err.message : 'Failed to reject application');
    } finally {
      setRejectingId(null);
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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // const getDurationColor = (duration: string) => {
  //   switch (duration.toLowerCase()) {
  //     case 'half-day':
  //       return 'bg-blue-100 text-blue-800 border-blue-200';
  //     case 'full-day':
  //       return 'bg-purple-100 text-purple-800 border-purple-200';
  //     case 'multiple-days':
  //       return 'bg-teal-100 text-teal-800 border-teal-200';
  //     default:
  //       return 'bg-gray-100 text-gray-800 border-gray-200';
  //   }
  // };

  useEffect(() => {
    fetchApplications();
  }, [userDetails?.organization_name]);

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Loading applications...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen w-full bg-gray-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Applications</h1>
        </div>
        <Card className="w-full shadow-md border-0 bg-white">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Applications</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button onClick={handleRefresh} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Applications</h1>
          <p className="text-gray-600">Review and manage leave applications from employees</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Applications Summary */}
      <Card className="w-full shadow-md border-0 bg-white mb-8">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <FilePlus className="w-6 h-6" />
            Applications Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{myApplications.length}</div>
              <div className="text-sm text-blue-700">Total Applications</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{myApplications.filter(a => a.status === 'pending').length}</div>
              <div className="text-sm text-yellow-700">Pending Applications</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{myApplications.filter(a => a.status === 'approved').length}</div>
              <div className="text-sm text-green-700">Approved Applications</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{myApplications.filter(a => a.status === 'rejected').length}</div>
              <div className="text-sm text-red-700">Rejected Applications</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {!applicationsFetched ? (
        <Card className="w-full shadow-md border-0 bg-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <span className="ml-3 text-gray-600">Fetching your records...</span>
            </div>
          </CardContent>
        </Card>
      ) : myApplications.length === 0 ? (
        <Card className="w-full shadow-md border-0 bg-white">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Folder className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Applications Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                No leave applications have been submitted yet. Applications will appear here once employees submit their requests.
              </p>
              <Button onClick={handleRefresh} variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myApplications.map((application) => (
            <Card key={application.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white overflow-hidden">
              {/* Header */}
              <div className="bg-blue-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {application.employee_id}
                    </h3>
                    <p className="text-blue-100 text-xs">Leave Application</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                {/* Employee Information */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Employee</p>
                    <p className="font-semibold text-gray-800 text-sm">{application.employee_id}</p>
                  </div>
                </div>

                {/* Application Status */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    {getStatusIcon(application.status)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                </div>

                {/* Leave Details */}
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <FilePlus className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-green-600 font-medium">Leave Title</p>
                    <p className="font-semibold text-gray-800 text-sm">{application.title}</p>
                  </div>
                </div>

                {/* Leave Duration */}
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-600 font-medium">Leave Duration</p>
                    <p className="font-semibold text-gray-800 text-sm">{application.leave_duration}</p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Duration</p>
                    <p className="font-semibold text-gray-800 text-sm">{application.number_of_days} days</p>
                  </div>
                </div>

                {/* Leave Date */}
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 font-medium">Leave Date</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {application.leave_date instanceof Date ? 
                        application.leave_date.toLocaleDateString() : 
                        application.leave_date.toDate().toLocaleDateString()
                      }
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                      <Calendar className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Created</p>
                      <p className="font-semibold text-gray-800 text-sm">
                        {application.created_at instanceof Date ? 
                          application.created_at.toLocaleDateString() : 
                          application.created_at.toDate().toLocaleDateString()
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                      <Calendar className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Updated</p>
                      <p className="font-semibold text-gray-800 text-sm">
                        {application.updated_at instanceof Date ? 
                          application.updated_at.toLocaleDateString() : 
                          application.updated_at.toDate().toLocaleDateString()
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-colors"
                    disabled={application.status !== 'pending' || approvingId === application.id}
                    onClick={() => approveApplication(application.id)}
                  >
                    {approvingId === application.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent mr-1"></div>
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-4 h-4 mr-1" />
                        Approve
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                    disabled={application.status !== 'pending' || rejectingId === application.id}
                    onClick={() => rejectApplication(application.id)}
                  >
                    {rejectingId === application.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                      </>
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
