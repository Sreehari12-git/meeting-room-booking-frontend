import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

export const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-[#111827]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-[#111827]">
                <Outlet />
            </main>
        </div>
    )
}

