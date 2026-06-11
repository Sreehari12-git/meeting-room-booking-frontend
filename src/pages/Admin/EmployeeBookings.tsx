import { useEffect, useState } from "react";
import { getAllBookings } from "../../api/bookingApi"

function EmployeeBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getAll = async () => {
        setLoading(true);
        try {
            const data = await getAllBookings();
            setBookings(data);
        } catch (error) {
            setError("Failed to load bookings.")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAll();
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 px-8 py-10">
            <div className="mb-7 pb-5 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <i className="ti ti-calendar-stats text-gray-400 text-xl" aria-hidden="true" />
                    Employee Bookings
                </h1>
                <p className="text-sm text-gray-500 mt-1">All bookings across employees</p>
            </div>

            {loading && (
                <div className="flex items-center justify-center gap-2.5 text-gray-400 text-sm py-16">
                    <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                    Loading bookings…
                </div>
            )}

            {error && !loading && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    <span className="flex items-center gap-2">
                        <i className="ti ti-alert-circle" aria-hidden="true" />
                        {error}
                    </span>
                    <button onClick={getAll} className="text-red-700 underline hover:text-red-900 ml-4 font-medium">
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && bookings.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <i className="ti ti-calendar-off text-gray-400 text-xl" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">No bookings found</p>
                </div>
            )}

            {!loading && !error && bookings.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <i className="ti ti-user text-xs" aria-hidden="true" />
                                        Employee
                                    </span>
                                </th>
                                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <i className="ti ti-door text-xs" aria-hidden="true" />
                                        Room
                                    </span>
                                </th>
                                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <i className="ti ti-calendar text-xs" aria-hidden="true" />
                                        Date
                                    </span>
                                </th>
                                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <i className="ti ti-clock text-xs" aria-hidden="true" />
                                        Start Time
                                    </span>
                                </th>
                                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <i className="ti ti-clock-off text-xs" aria-hidden="true" />
                                        End Time
                                    </span>
                                </th>
                                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <i className="ti ti-clock-off text-xs" aria-hidden="true" />
                                        Status
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <i className="ti ti-user text-blue-700 text-sm" aria-hidden="true" />
                                            </div>
                                            <span className="font-medium text-gray-800">{booking.user?.name || "—"}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <i className="ti ti-door text-blue-700 text-sm" aria-hidden="true" />
                                            </div>
                                            <span className="text-gray-800">{booking.room?.name || "—"}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <i className="ti ti-calendar text-sm text-gray-400" aria-hidden="true" />
                                            {new Date(booking.startTime).toLocaleDateString([], {
                                                weekday: "long", day: "numeric", month: "short"
                                            })}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <i className="ti ti-clock text-sm text-gray-400" aria-hidden="true" />
                                            {new Date(booking.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <i className="ti ti-clock-off text-sm text-gray-400" aria-hidden="true" />
                                            {new Date(booking.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-gray-800">{booking.status || "—"}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default EmployeeBookings

