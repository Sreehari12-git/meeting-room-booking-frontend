import { useEffect, useState } from "react";
import { cancelBooking, getBookingHistory } from "../../api/bookingApi";

function BookingHistory() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState("");

  const fetchBookingHistory = async () => {
    setLoading(true);
    try {
      const response = await getBookingHistory();
      setBookings(response);
    } catch (error) {
      setError("Failed to load booking history.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const handleCancel = async (bookingId: number) => {
    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "CANCELED" }
            : booking
        )
      );
    } catch (error) {
      setCancelError("Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const getBookingStatus = (booking: any) => {
    if (booking.status === "CANCELED") return "CANCELED";
    const now = new Date();
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    if (now < start) return "UPCOMING";
    if (now >= start && now < end) return "ONGOING";
    return "COMPLETED";
  };

  const statusConfig: Record<string, { label: string; icon: string; className: string }> = {
    UPCOMING:  { label: "Upcoming",  icon: "ti-clock",        className: "bg-blue-100 text-blue-700"    },
    ONGOING:   { label: "Ongoing",   icon: "ti-clock-play",   className: "bg-yellow-100 text-yellow-700" },
    COMPLETED: { label: "Completed", icon: "ti-circle-check", className: "bg-green-100 text-green-700"  },
    CANCELED:  { label: "Canceled",  icon: "ti-circle-x",     className: "bg-red-100 text-red-600"      },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBookings((prev) => [...prev]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <i className="ti ti-history text-gray-400 text-xl" aria-hidden="true" />
          Booking History
        </h1>
        <p className="text-sm text-gray-500 mt-1">Your past and upcoming room bookings</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2.5 text-gray-400 text-sm py-16">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          Loading booking history…
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <span className="flex items-center gap-2">
            <i className="ti ti-alert-circle" aria-hidden="true" />
            {error}
          </span>
          <button onClick={fetchBookingHistory} className="text-red-700 underline hover:text-red-900 ml-4 font-medium">
            Retry
          </button>
        </div>
      )}

      {cancelError && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          <i className="ti ti-alert-circle flex-shrink-0" aria-hidden="true" />
          {cancelError}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-20">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-calendar-off text-gray-400 text-xl" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-gray-500">No booking history found</p>
          <p className="text-xs text-gray-400 mt-1">Your past and upcoming bookings will appear here</p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <i className="ti ti-door text-xs" aria-hidden="true" />
                    Room Name
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
                    <i className="ti ti-info-circle text-xs" aria-hidden="true" />
                    Status
                  </span>
                </th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <i className="ti ti-settings text-xs" aria-hidden="true" />
                    Action
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => {
                const status = getBookingStatus(booking);
                const sc = statusConfig[status] ?? { label: status, icon: "ti-point", className: "bg-gray-100 text-gray-600" };

                return (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <i className="ti ti-door text-blue-700 text-lg" aria-hidden="true" />
                        </div>
                        <span className="font-medium text-gray-800">{booking.room?.name || "—"}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <i className="ti ti-calendar text-sm text-gray-400" aria-hidden="true" />
                        {new Date(booking.startTime).toLocaleDateString([], {
                          weekday: "long", day: "numeric", month: "short",
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
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.className}`}>
                        <i className={`ti ${sc.icon} text-xs`} aria-hidden="true" />
                        {sc.label}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {status === "UPCOMING" ? (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <i className={`ti ${cancellingId === booking.id ? "ti-loader-2 animate-spin" : "ti-calendar-x"} text-xs`} aria-hidden="true" />
                          {cancellingId === booking.id ? "Cancelling…" : "Cancel"}
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingHistory;

