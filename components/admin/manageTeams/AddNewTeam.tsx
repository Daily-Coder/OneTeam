'use client'
import {
    Dialog,
    DialogContent,
  
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/context/userContext"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {  useState } from "react"
import { DocumentData } from "firebase-admin/firestore"
import { Textarea } from "@/components/ui/textarea"
import { TfiControlBackward } from "react-icons/tfi";
import { TfiControlForward } from "react-icons/tfi";
import { firestoreConfig } from "@/config/firestoreConfig"
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore"
import { RxCross2 } from "react-icons/rx";

type INewTeam = {
    teamName: string,
    teamMembers: string[],
    teamLead: string,
    deadline: string | null,
    projectDescription: string,
    department: string,
}
export default function AddNewTeam() {
    const [isOpen, setIsOpen] = useState(false);
    const [processing, setProcessing] = useState<boolean>(false)
    const [teamDetails, setTeamDetails] = useState<INewTeam>({
        teamName: '',
        teamMembers: [],
        deadline: null,
        projectDescription: '',
        department: '',
        teamLead: ''
    })
    const [employeesFetched, setEmployeesFetched] = useState<boolean>(false);
    const [employees, setEmployees] = useState<DocumentData[]>([])
    const [stage, setStage] = useState<number>(0);
    const { userDetails } = useUser();



    async function createNewTeam() {
        const instance = firestoreConfig.getInstance()
        try {
            if (processing) return;
            setProcessing(true)
            const newTeam = await addDoc(collection(instance.getDb(), 'Teams'), {
                organization_name: userDetails?.organization_name,
                team_name: teamDetails.teamName,
                team_lead: teamDetails.teamLead,
                team_members: teamDetails.teamMembers,
                created_at: serverTimestamp(),
                project_description: teamDetails.projectDescription,
                department: teamDetails.department,
                deadline: teamDetails.deadline ? new Date(teamDetails.deadline) : null,
                updated_at: serverTimestamp(),
                project_status: 'initialization'
            })
            setStage(0)
            setTeamDetails(prev => ({
                ...prev,
                teamName: '',
                teamMembers: [],
                deadline: null,
                projectDescription: '',
                department: '',
                teamLead: ''
            }))
            setIsOpen(false)
        }
        catch (err) {
            console.log("error while creating new team", err)
        }
        finally {
            setProcessing(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="px-5 py-3 bg-blue-600 text-white font-normal cursor-pointer rounded-md">
                    <p className="text-center">Create New Team</p>
                </div>
            </DialogTrigger>
            <DialogContent className="w-full md:w-[700px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Create New Team</DialogTitle>
                </DialogHeader>
                {
                    stage == 0 && <div className="space-y-4">
                        <Label>Team Name</Label>
                        <Input value={teamDetails.teamName} onChange={(e) => setTeamDetails(prev => ({ ...prev, teamName: e.target.value }))} />
                        <Label>Project Description</Label>
                        <Textarea value={teamDetails.projectDescription} onChange={(e) => setTeamDetails(prev => ({ ...prev, projectDescription: e.target.value }))} />
                        <Label>Select Department</Label>
                        <Select onValueChange={async (value) => {
                            try {
                                setEmployeesFetched(false)
                                setTeamDetails(prev => ({ ...prev, department: value }))
                                const instance = firestoreConfig.getInstance()
                                const docSnap = await getDocs(query(collection(instance.getDb(), 'Users'), where('organization_name', '==', userDetails?.organization_name), where('department', '==', value)))
                                const temp: DocumentData[] = []
                                docSnap.docs.map(doc => temp.push({ id: doc.id, ...doc.data() }));
                                setEmployees(temp);
                                setEmployeesFetched(true)
                            }
                            catch (err) {
                                console.log("error while fetching employees for creating new team",err)
                            }
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent onSelect={(e) => console.log(e)}>
                                <SelectItem value="Development">Development</SelectItem>
                                <SelectItem value="Devops">DevOps</SelectItem>
                                <SelectItem value="UI/UX">{`UI/UX (User Interface/User Experience)`}</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="HR">Human Resource</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex justify-end">
                            <div className="rounded-md py-2 font-light cursor-pointer mt-5 flex items-center gap-1" onClick={() => {
                                if (teamDetails.teamName != "" && employeesFetched) {
                                    setStage(1)
                                }
                            }} style={{ opacity: employeesFetched && teamDetails.teamName != "" ? 1 : 0.3 }}>
                                <p className="text-center text-black ">next</p>
                                <TfiControlForward size={17} />
                            </div>
                        </div>
                    </div>
                }
                {
                    stage == 1 && <div className="space-y-4">
                        <Label>Project Deadline</Label>
                        <Input type="date" value={teamDetails.deadline ?? ''} onChange={(e) => setTeamDetails(prev => ({ ...prev, deadline: e.target.value }))} />
                        <Label>Team Lead</Label>
                        <Select onValueChange={(value) => {
                            setTeamDetails(prev => ({ ...prev, teamLead: value }))
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent onSelect={(e) => console.log(e)}>
                                {
                                    employees.map((employee) => {
                                        return (
                                            <SelectItem value={employee?.employee_id} key={employee.employee_id}>{employee?.employee_id}</SelectItem>
                                        )
                                    })
                                }
                            </SelectContent>
                        </Select>
                        <Label>Team Members</Label>
                        <div className="flex items-center gap-2 overflow-x-scroll py-2">
                            {
                                teamDetails.teamMembers.map(member => {
                                    return (
                                        <div className="px-2 py-1 bg-[#f1f1f1] rounded-md flex gap-1 items-center" key={member}>
                                            <p className=" text-[10px] text-black">{member}</p>
                                            <RxCross2 size={12} className="cursor-pointer" onClick={() => {
                                                setTeamDetails(prev => ({ ...prev, teamMembers: teamDetails.teamMembers.filter(a => a != member) }))
                                            }} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <Select onValueChange={(value) => {
                            setTeamDetails(prev => ({ ...prev, teamMembers: [...teamDetails.teamMembers, value] }))
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent onSelect={(e) => console.log(e)}>
                                {
                                    employees.filter(emp => !teamDetails.teamMembers.includes(emp.employee_id)).map(emp => {
                                        return (
                                            <SelectItem value={emp.employee_id} key={emp.employee_id}>{emp.employee_id}</SelectItem>
                                        )
                                    })
                                }
                            </SelectContent>
                        </Select>
                        <div className="flex justify-between" >
                            <div className="rounded-md py-2 font-light cursor-pointer mt-5 flex items-center gap-1" onClick={() => setStage(0)}>
                                <TfiControlBackward size={17} />
                                <p className="text-center text-black ">back</p>
                            </div>
                            <div className="bg-blue-500 rounded-md px-5 py-2 font-medium cursor-pointer mt-5" onClick={createNewTeam}>
                                <p className="text-center text-white">{processing ? `Creating New Team ...` : `Create New Team`}</p>
                            </div>
                        </div>
                    </div>
                }
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}