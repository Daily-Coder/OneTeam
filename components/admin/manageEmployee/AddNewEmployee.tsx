'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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


export default function AddNewEmployee() {
    const { userDetails } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const [employeeDetails, setEmployeeDetails] = useState({
        full_name: '',
        personal_email: '',
        employee_id: '',
        password: '',
        contact: 0,
        joiningDate: '',
        department: '',
        current_role: ''
    })
    const [isOpen, setIsOpen] = useState(false);

    async function createNewEmployee() {
        try {
            setLoading(true)
            await fetch('/api/addEmployee', {
                method: 'POST',
                body: JSON.stringify({
                    full_name: employeeDetails.full_name,
                    personal_email: employeeDetails.personal_email,
                    employee_id: employeeDetails.employee_id,
                    password: employeeDetails.password,
                    contact: employeeDetails.contact,
                    joiningDate: employeeDetails.joiningDate,
                    department: employeeDetails.department,
                    current_role: employeeDetails.current_role,
                    organizationName: userDetails?.organization_name
                })
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status != 200) {
                        setLoading(false)
                    }
                    else {
                        setIsOpen(false);
                        setEmployeeDetails((prev) => ({
                            ...prev,
                            full_name: "",
                            personal_email: "",
                            employee_id: "",
                            password: "",
                            contact: 0,
                            joiningDate: "",
                            department: "",
                            current_role: "",
                        }));
                    }
                })

        }
        catch (err) {
            setLoading(false)
            console.log("error in api call",err)
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="px-5 py-3 bg-blue-600 text-white font-normal cursor-pointer rounded-md">
                    <p className="text-center">Create New Employee ID</p>
                </div>
            </DialogTrigger>
            <DialogContent className="w-full md:w-[700px]" >
                <DialogHeader>
                    <DialogTitle className="text-center">Add New Employee</DialogTitle>
                    <DialogDescription className="text-center">
                        Fill in all the details to add new employee to the organization
                    </DialogDescription>
                </DialogHeader>
                <Label>Employee Id</Label>
                <Input type="email" onChange={(e) => setEmployeeDetails(prev => ({ ...prev, employee_id: e.target.value }))} value={employeeDetails.employee_id} />
                <Label>Password</Label>
                <Input type="password" onChange={(e) => setEmployeeDetails(prev => ({ ...prev, password: e.target.value }))} value={employeeDetails.password} />
                <Label>Full Name</Label>
                <Input type="text" />
                <div className="w-full flex items-center gap-5">
                    <span className="w-[50%]">
                        <Label>Personal Email </Label>
                        <Input type="text" className="my-3" onChange={(e) => setEmployeeDetails(prev => ({ ...prev, personal_email: e.target.value }))} value={employeeDetails.personal_email} />
                    </span>
                    <span className="w-[50%]">
                        <Label>Contact</Label>
                        <Input
                            type="number"
                            className="my-3"
                            onChange={(e) =>
                                setEmployeeDetails((prev) => ({
                                    ...prev,
                                    contact: Number(e.target.value),
                                }))
                            }
                            value={employeeDetails.contact !== 0 ? employeeDetails.contact : ""}
                        />
                    </span>

                </div>
                <div className="w-full flex items-center gap-5">
                    <span className="w-[60%]">
                        <Label>Organization Name</Label>
                        <Input type="text" className="my-3" disabled value={userDetails?.organization_name} />
                    </span>
                    <span className="w-[40%]">
                        <Label>Joining Date</Label>
                        <Input type="date" className="my-3" onChange={(e) => setEmployeeDetails(prev => ({ ...prev, joiningDate: e.target.value }))} value={employeeDetails.joiningDate} />
                    </span>
                </div>
                <Label>Department</Label>
                <Select onValueChange={(e) => {
                    setEmployeeDetails(prev => ({ ...prev, department: e }))
                }}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent onSelect={(e) => console.log(e)}>
                        <SelectItem value="Development">Developer</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="UI/UX">{`UI/UX (User Interface/User Experience)`}</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="HR">Human Resource</SelectItem>
                    </SelectContent>
                </Select>
                <Label>Current Position/Role</Label>
                <Input type="text" onChange={(e) => setEmployeeDetails(prev => ({ ...prev, current_role: e.target.value }))} value={employeeDetails.current_role} />

                <div className="bg-blue-500 rounded-md px-4 py-2 mx-auto w-fit my-5" onClick={createNewEmployee}>
                    <p className="text-center font-medium text-white cursor-pointer">{loading ? `Submitting...` : `Submit`}</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}