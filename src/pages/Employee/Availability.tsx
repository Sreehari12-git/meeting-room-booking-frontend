import { useState } from "react"
import { checkAvailability } from "../../api/bookingApi"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Clock,
  Search,
  Users,
  CheckCircle2,
  ArrowRight,
  MapPin,
} from "lucide-react"

function Availability() {
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const combineDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}:00`).toISOString();
  }

  const navigate = useNavigate()

  const checkAvailabilityHandler = async () => {
    try {
      setLoading(true)
      setSearched(false)
      const combinedStart = combineDateTime(date, startTime)
      const combinedEnd = combineDateTime(date, endTime)
      const data = await checkAvailability(combinedStart, combinedEnd)
      setRooms(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen p-8">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Check Availability</h1>
        <p className="text-sm text-gray-500 mt-1">Select a date and time to find available rooms.</p>
      </div>

      <div className="h-px bg-gray-200 mb-6" />

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 max-w-2xl">
        <div className="flex flex-wrap gap-4 items-end">

          <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <Calendar size={11} /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 h-10 text-sm text-gray-800 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <Clock size={11} /> Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 h-10 text-sm text-gray-800 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[130px]">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <Clock size={11} /> End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 h-10 text-sm text-gray-800 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

         <button
            onClick={checkAvailabilityHandler}
            disabled={loading}
            className="h-10 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors duration-150 flex items-center gap-2 flex-shrink-0"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Searching...
              </>
            ) : (
              <>
                <Search size={14} />
                Check Availability
              </>
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-w-4xl">
          <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
            {["w-20", "w-16", "w-24", "w-12"].map((w, i) => (
              <div key={i} className={`h-3 ${w} rounded-full bg-gray-200 animate-pulse`} />
            ))}
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-100 items-center">
              <div className="h-4 w-32 rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-16 rounded bg-gray-100 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-6 w-16 rounded-full bg-gray-100 animate-pulse" />
              </div>
              <div className="h-8 w-14 rounded-lg bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {searched && !loading && rooms.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-14 flex flex-col items-center gap-2 text-center max-w-4xl">
          <Search size={22} className="text-gray-300 mb-1" />
          <p className="text-sm font-semibold text-gray-500">No rooms available</p>
          <p className="text-xs text-gray-400">Try a different date or time range.</p>
        </div>
      )}

      {!loading && rooms.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-w-4xl">

          <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {rooms.length} Room{rooms.length > 1 ? "s" : ""} Available
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
            {[
              { icon: <MapPin size={11} />, label: "ROOM NAME" },
              { icon: <Users size={11} />, label: "CAPACITY" },
              { icon: null, label: "AMENITIES" },
              { icon: null, label: "" },
            ].map((col, i) => (
              <p key={i} className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {col.icon}{col.label}
              </p>
            ))}
          </div>

          {rooms.map((room: any, idx: number) => (
            <div
              key={room.id}
              className={`grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors duration-100 ${idx !== rooms.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <p className="text-sm font-semibold text-gray-800">{room.name}</p>
              <p className="text-sm text-gray-500">{room.capacity ? `${room.capacity} people` : "—"}</p>
              <div className="flex flex-wrap gap-1.5">
                {room.Amenities?.map((a: string) => (
                  <span key={a} className="text-xs px-2.5 py-0.5 rounded-full border border-gray-200 text-gray-500 bg-white">
                    {a}
                  </span>
                ))}
              </div>
              <div>
  <button
    onClick={() => 
      navigate("/book-room", { 
        state: { 
          preSelectedRoom: room,
          preSelectedDate: date,
          preSelectedStart: startTime,
          preSelectedEnd: endTime 
        } 
      })
    }
    className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-150"
  >
    Book <ArrowRight size={11} />
  </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Availability
