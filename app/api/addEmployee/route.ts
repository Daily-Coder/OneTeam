import { FirebaseAdminConfig } from "@/config/fbAdminConfig";
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { full_name, personal_email, employee_id, password, contact, joiningDate, department, current_role, organizationName } = body;

        const instance = FirebaseAdminConfig.getInstance();
        const newUser = await instance.getAuth().createUser({ email: employee_id, password: password })
        if (!newUser) {
            return NextResponse.json({
                status: 400,
                message: 'employee with this id already exist'
            })
        }
        const newEmployeeId=newUser.uid
        await instance.getDb().collection('Users').doc(newEmployeeId).set({
            employee_id:employee_id,
            address:null,
            contact:contact,
            created_at:new Date(),
            current_role:current_role,
            current_status:'away',
            joining_date:new Date(joiningDate),
            name:full_name,
            organization_name:organizationName,
            personal_email:personal_email,
            role:'employee',
            team:null,
            team_role:null,
            yearly_leaves:30,
            department:department
        })
        return NextResponse.json({
            status: 200,
            message: 'emplpoyee added'
        })
    }
    catch (err) {
        return NextResponse.json({
            status: 400,
            message: err instanceof Error ? err.message : 'unknown error occured'
        })
    }
}