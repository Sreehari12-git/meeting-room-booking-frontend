import { useEffect, useState } from "react"
import { getRooms } from "../../api/roomApi";
import { bookRoom } from "../../api/bookingApi";

const AMENITY_ICONS: Record<string, string> = {
  "Projector": "ti-device-projector",
  "Whiteboard": "ti-writing",
  "TV Screen": "ti-device-tv",
  "Video Conferencing": "ti-video",
  "Sound System": "ti-volume",
  "Air Conditioning": "ti-wind",
  "Microphone": "ti-microphone",
}

const timeSlots: any[] = [];
for (let h = 8; h <= 18; h++) {
  for (let m = 0; m < 60; m += 30) {
    if (h === 18 && m > 0) break;
    const totalMin = h * 60 + m;
    const ampm = h < 12 ? "AM" : "PM";
    const h12 = h > 12 ? h - 12 : h;
    const label = `${h12}:${m === 0 ? "00" : m} ${ampm}`;
    timeSlots.push({ label, totalMin });
  }
}

function BookRoom() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState("")
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const toISO = (dateStr: string, totalMin: number) => {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${dateStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      setError("Failed to load rooms. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (room: any) => {
    setSelectedRoom(room);
    setBookingError("");
    setBookingSuccess(false);
    setStartTime(null);
    setEndTime(null);
  };

  const handleBooking = async () => {
    if (!bookingDate || startTime === null || endTime === null) {
      setBookingError("Please select a date, start time, and end time.");
      return;
    }

    const start = toISO(bookingDate, startTime);
    const end = toISO(bookingDate, endTime);

    if (new Date(end) <= new Date(start)) {
      setBookingError("End time must be after start time.");
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    try {
      await bookRoom(selectedRoom.id, start,end);
      setBookingSuccess(true);
      setTimeout(() => {
        setSelectedRoom(null);
        setBookingSuccess(false);
      }, 2000);
    } catch (error: any) {
      const message = error.response?.data?.message || "This slot is already booked. Please choose a different time.";
      setBookingError(message);
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // useEffect(() => {
  //   if(location.state) {
  //     const {preSelectedRoom,preSelectedDate,preSelectedStart,preSelectedEnd} = location.state;

  //     if(preSelectedRoom) {
  //       setSelectedRoom(preSelectedRoom);
  //     }

  //     if(preSelectedDate && preSelectedStart) {
  //       setStartTime(`${preSelectedDate}T${preSelectedStart}`)
  //     }

  //     if(preSelectedDate && preSelectedEnd) {
  //       setEndTime(`${preSelectedDate}T${preSelectedEnd}`)
  //     }
  //   }
  // },[location.state])

  const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
    AVAILABLE:   { label: "Available",   dot: "bg-green-600",  text: "text-green-700"  },
    OCCUPIED:    { label: "Occupied",    dot: "bg-red-600",    text: "text-red-700"    },
    MAINTANENCE: { label: "Maintenance", dot: "bg-amber-600",  text: "text-amber-700"  },
  }

  const labelClass = "flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5"
  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">

      {selectedRoom && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-7 w-full max-w-md overflow-y-auto max-h-[90vh]">

            <div className="flex items-start justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <i className="ti ti-door text-blue-700 text-xl" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-800">Book a room</h2>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <i className="ti ti-building text-gray-400" aria-hidden="true" />
                    {selectedRoom.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition"
                aria-label="Close"
              >
                <i className="ti ti-x text-sm" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center gap-4 px-3 py-2.5 bg-gray-50 rounded-lg mb-5 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <i className="ti ti-users" aria-hidden="true" />
                {selectedRoom.capacity} people
              </span>
              {selectedRoom.Amenities?.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <i className="ti ti-layout-grid" aria-hidden="true" />
                  {selectedRoom.Amenities.slice(0, 3).join(", ")}
                  {selectedRoom.Amenities.length > 3 && ` +${selectedRoom.Amenities.length - 3}`}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label className={labelClass}>
                <i className="ti ti-calendar" aria-hidden="true" />
                Date
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={inputClass}
              /> 
            </div>

            <div className="mb-4">
              <label className={labelClass}>
                <i className="ti ti-clock" aria-hidden="true" />
                Start time
              </label>
              <div className="grid grid-cols-6 gap-1.5">
               {timeSlots.map((slot) => {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentTotalMin = now.getHours() * 60 + now.getMinutes();
  const isPast = bookingDate === todayStr && slot.totalMin <= currentTotalMin;

  return (
    <button
      key={slot.totalMin}
      type="button"
      disabled={isPast}
      onClick={() => {
        setStartTime(slot.totalMin);
        if (endTime !== null && endTime <= slot.totalMin) setEndTime(null);
      }}
      className={`py-1.5 text-xs rounded-lg border transition-colors ${
        startTime === slot.totalMin
          ? "bg-blue-600 text-white border-blue-600 font-medium"
          : isPast
          ? "border-gray-100 text-gray-300 cursor-not-allowed"
          : "border-gray-200 text-gray-500 hover:bg-gray-50"
      }`}
    >
      {slot.label}
    </button>
  );
})}
              </div>
            </div>

            <div className="mb-5">
              <label className={labelClass}>
                <i className="ti ti-clock-check" aria-hidden="true" />
                End time
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {timeSlots.map((slot) => {
                  const disabled = startTime !== null && slot.totalMin <= startTime;
                  return (
                    <button
                      key={slot.totalMin}
                      type="button"
                      disabled={disabled}
                      onClick={() => setEndTime(slot.totalMin)}
                      className={`py-1.5 text-xs rounded-lg border transition-colors ${
                        endTime === slot.totalMin
                          ? "bg-blue-600 text-white border-blue-600 font-medium"
                          : disabled
                          ? "border-gray-100 text-gray-300 cursor-not-allowed"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {bookingError && (
              <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                <i className="ti ti-alert-circle text-sm flex-shrink-0" aria-hidden="true" />
                {bookingError}
              </div>
            )}

            {bookingSuccess && (
              <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg">
                <i className="ti ti-circle-check text-sm flex-shrink-0" aria-hidden="true" />
                Room booked successfully! Closing…
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedRoom(null)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i className="ti ti-x text-xs" aria-hidden="true" />
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={bookingLoading || bookingSuccess}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <i className="ti ti-calendar-check text-sm" aria-hidden="true" />
                {bookingLoading ? "Booking…" : "Confirm booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-7 pb-5 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <i className="ti ti-building-community text-gray-400 text-xl" aria-hidden="true" />
          Meeting rooms
        </h1>
        <p className="text-sm text-gray-500 mt-1">Select a room to make a booking</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2.5 text-gray-400 text-sm py-16">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          Loading rooms…
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <span className="flex items-center gap-2">
            <i className="ti ti-alert-circle" aria-hidden="true" />
            {error}
          </span>
          <button onClick={fetchRooms} className="text-red-700 underline hover:text-red-900 ml-4 font-medium">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && rooms.length === 0 && (
        <div className="text-center py-20">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-door text-gray-400 text-xl" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-gray-500">No rooms available</p>
          <p className="text-xs text-gray-400 mt-1">Check back later or contact your admin</p>
        </div>
      )}

      {!loading && !error && rooms.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <i className="ti ti-door text-xs" aria-hidden="true" />Room
                  </span>
                </th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <i className="ti ti-users text-xs" aria-hidden="true" />Capacity
                  </span>
                </th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <i className="ti ti-layout-grid text-xs" aria-hidden="true" />Amenities
                  </span>
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rooms.map((room) => {
                const sc = statusConfig[room.status] ?? { label: room.status, dot: "bg-gray-400", text: "text-gray-500" }
                const available = room.status === "AVAILABLE" || "MAINTENANCE";
                return (
                  <tr key={room.id} className={`transition-colors ${available ? "hover:bg-gray-50" : "opacity-50"}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${available ? "bg-blue-50" : "bg-gray-100"}`}>
                          <i className={`ti ti-door text-lg ${available ? "text-blue-700" : "text-gray-400"}`} aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{room.name || "—"}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            <span className={`text-xs ${sc.text}`}>{sc.label}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {room.capacity ? (
                        <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                          <i className="ti ti-users text-sm" aria-hidden="true" />
                          {room.capacity} people
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      {room.Amenities && room.Amenities.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {room.Amenities.map((amenity: string, index: number) => (
                            <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-50 text-gray-500 border border-gray-100">
                              <i className={`ti ${AMENITY_ICONS[amenity] ?? "ti-star"} text-xs`} aria-hidden="true" />
                              {amenity}
                            </span>
                          ))}
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openModal(room)}
                        disabled={!available}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          available
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        }`}
                      >
                        <i className={`ti ${available ? "ti-calendar-plus" : "ti-ban"} text-xs`} aria-hidden="true" />
                        {available ? "Book" : "Unavailable"}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookRoom;

