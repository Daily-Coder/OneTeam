import ManageApplications from "@/components/admin/ManageApplications";
import ManageEmployee from "@/components/admin/ManageEmployee";
import ManageTeams from "@/components/admin/ManageTeams";
import ManageTickets from "@/components/admin/ManageTickets";
import PerformanceAnalytics from "@/components/admin/PerformanceAnalytics";
import { ReactElement } from "react";
import { IconType } from "react-icons";
import { FcSalesPerformance } from "react-icons/fc";
import { MdGroups2 } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
import { IoTicketOutline } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";

type IAdminRoutes={
    title:string,
    value:string,
    component:ReactElement,
    icon:IconType
}
export const adminRoutes:IAdminRoutes[]=[
    {
        title:"Matrix",
        value:'performance-matrix',
        component:<PerformanceAnalytics/>,
        icon:FcSalesPerformance
    },
    {
        title:'Employees',
        value:'manage-employees',
        component:<ManageEmployee/>,
        icon:MdGroups2
    },
    {
        title:'Teams',
        value:'manage-teams',
        component:<ManageTeams/>,
        icon:RiTeamLine
    },
    {
        title:'Tickets',
        value:'manage-tickets',
        component:<ManageTickets/>,
        icon:IoTicketOutline
    },
    {
        title:'Applications',
        value:'manage-applications',
        component:<ManageApplications/>,
        icon:IoDocumentText
    }
]