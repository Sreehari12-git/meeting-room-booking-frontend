import { NavLink, useNavigate } from "react-router-dom"
import { getCurrentUser, logoutUser } from "../api/authApi";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getCurrentUser();
      setRole(response.data.role);
    }
    fetchUser();
  }, [])

  const logout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20"
        : "text-[#7d8590] hover:bg-[#21262d] hover:text-[#e6edf3]"
    }`;

  return (
    <aside className="flex flex-col h-screen w-60 bg-[#161b22] border-r border-[#21262d] text-[#7d8590] px-4 py-7 flex-shrink-0">
      <div className="mb-8 px-2">
        <h1 className="text-[#e6edf3] text-base font-bold tracking-[0.15em] uppercase">
          MEETING ROOM
        </h1>
        <span className="inline-flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span>
          <p className="text-[#7d8590] text-[11px] tracking-widest uppercase font-medium">
            {role || "—"}
          </p>
        </span>
      </div>

      <p className="text-[10px] text-[#484f58] font-semibold tracking-[0.2em] uppercase px-3 mb-2">
        Navigation
      </p>

      <nav className="flex flex-col gap-0.5 flex-1">
        {role === "ADMIN" && (
          <>
            <NavLink to="/create-room" className={navLink}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Room
            </NavLink>
            <NavLink to="/create-user" className={navLink}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add User
            </NavLink>
            <NavLink to="/all-bookings" className={navLink}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a8.25 8.25 0 0 1 11.5-7.613" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 13v2l1.5 1.5" />
                <circle cx="17" cy="17" r="3.5" strokeLinecap="round" />
              </svg>
              Employee Bookings
            </NavLink>
          </>
        )}

        {role === "EMPLOYEE" && (
          <>
            {/* <NavLink to="/check-availability" className={navLink}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Check Availability
            </NavLink> */}
            <NavLink to="/book-room" className={navLink}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Book Room
            </NavLink>
            <NavLink to="/book-room" className={navLink}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Booking History
            </NavLink>
          </>
        )}
      </nav>

      <div className="border-t border-[#21262d] pt-4 mt-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#f85149] hover:bg-[#3a1a1a] hover:text-red-300 transition-all duration-200"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;