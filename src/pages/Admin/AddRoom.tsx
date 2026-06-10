import { useEffect, useState } from "react"
import { createRoom, deleteRoom, getRooms, updateRoom } from "../../api/roomApi"

const AMENITY_OPTIONS = ["Projector", "Whiteboard", "TV Screen", "Video Conferencing", "Sound System", "Air Conditioning", "Microphone"]

const AMENITY_ICONS: Record<string, string> = {
  "Projector":          "ti-device-projector",
  "Whiteboard":         "ti-writing",
  "TV Screen":          "ti-device-tv",
  "Video Conferencing": "ti-video",
  "Sound System":       "ti-volume",
  "Air Conditioning":   "ti-wind",
  "Microphone":         "ti-microphone",
}

function AddRoom() {
  const [name, setName] = useState("")
  const [status, setStatus] = useState("AVAILABLE")
  const [capacity, setCapacity] = useState("")
  const [amenities, setAmenities] = useState<string[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [editName, setEditName] = useState("")
  const [editCapacity, setEditCapacity] = useState(0)
  const [editStatus, setEditStatus] = useState("")
  const [editAmenities, setEditAmenities] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [isError, setError] = useState(false)

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  const addRoom = async () => {
    try {
      const capacityNumber = Number(capacity)
      await createRoom(name, status, capacityNumber, amenities)
      setMessage("Room added successfully!")
      setError(false)
      setName("")
      setStatus("AVAILABLE")
      setCapacity("")
      setAmenities([])
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.log(error)
      setMessage("Failed to add room.")
      setError(true)
    }
  }

  const fetchRooms = async () => {
    try {
      const response = await getRooms()
      setRooms(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { fetchRooms() }, [])

  const delRoom = async (name: string) => {
    try {
      await deleteRoom(name)
      fetchRooms()
    } catch (error) {
      console.log(error)
    }
  }

  const updRoom = async (name: string, data: any) => {
    try {
      await updateRoom(name, data)
      fetchRooms()
      setSelectedRoom(null)
    } catch (error) {
      console.log(error)
    }
  }

  const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
    AVAILABLE:   { label: "Available",   className: "bg-green-50 text-green-800 border border-green-200",  dot: "bg-green-600" },
    OCCUPIED:    { label: "Occupied",    className: "bg-red-50 text-red-800 border border-red-200",        dot: "bg-red-600"   },
    MAINTANENCE: { label: "Maintenance", className: "bg-amber-50 text-amber-800 border border-amber-200",  dot: "bg-amber-600" },
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
  const labelClass = "flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5"

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-7 w-full max-w-md">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <i className="ti ti-pencil text-blue-700 text-sm" aria-hidden="true" />
                </div>
                Edit room
              </h2>
              <button
                onClick={() => setSelectedRoom(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition"
                aria-label="Close"
              >
                <i className="ti ti-x text-sm" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={labelClass}>
                  <i className="ti ti-door" aria-hidden="true" /> Room name
                </label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>
                  <i className="ti ti-users" aria-hidden="true" /> Capacity
                </label>
                <input type="number" value={editCapacity} onChange={e => setEditCapacity(Number(e.target.value))} className={inputClass} />
              </div>
            </div>

            <div className="mb-4">
              <label className={labelClass}>
                <i className="ti ti-info-circle" aria-hidden="true" /> Status
              </label>
              <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className={inputClass + " cursor-pointer"}>
                <option value="AVAILABLE">Available</option>
                <option value="MAINTANENCE">Maintenance</option>
              </select>
            </div>

            <div className="mb-1">
              <label className={labelClass}>
                <i className="ti ti-layout-grid" aria-hidden="true" /> Amenities
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {AMENITY_OPTIONS.map(amenity => (
                  <button key={amenity} type="button"
                    onClick={() => setEditAmenities(prev =>
                      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
                    )}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      editAmenities.includes(amenity)
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-white text-gray-500 border-gray-200 hover:border-blue-200 hover:text-blue-600"
                    }`}>
                    <i className={`ti ${AMENITY_ICONS[amenity]} text-xs`} aria-hidden="true" />
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
              <button onClick={() => setSelectedRoom(null)}
                className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-gray-50 transition">
                <i className="ti ti-x text-xs" aria-hidden="true" /> Cancel
              </button>
              <button onClick={() => updRoom(selectedRoom.name, { name: editName, capacity: editCapacity, status: editStatus, amenities: editAmenities })}
                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition">
                <i className="ti ti-check text-xs" aria-hidden="true" /> Update room
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-7 pb-5 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <i className="ti ti-building-plus text-gray-400 text-xl" aria-hidden="true" />
          Add meeting room
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure a new room and its available amenities</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-7 max-w-xl shadow-sm mb-10">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className={labelClass}>
              <i className="ti ti-door" aria-hidden="true" /> Room name
            </label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Boardroom A" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>
              <i className="ti ti-users" aria-hidden="true" /> Capacity
            </label>
            <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="mb-4">
          <label className={labelClass}>
            <i className="ti ti-info-circle" aria-hidden="true" /> Status
          </label>
          <select value={status} onChange={e => setStatus(e.target.value)} className={inputClass + " cursor-pointer"}>
            <option value="AVAILABLE">Available</option>
            <option value="MAINTANENCE">Maintenance</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>
            <i className="ti ti-layout-grid" aria-hidden="true" /> Amenities
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {AMENITY_OPTIONS.map(amenity => (
              <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  amenities.includes(amenity)
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-white text-gray-500 border-gray-200 hover:border-blue-200 hover:text-blue-600"
                }`}>
                <i className={`ti ${AMENITY_ICONS[amenity]} text-xs`} aria-hidden="true" />
                {amenity}
              </button>
            ))}
          </div>
        </div>

        <button type="button" onClick={addRoom}
          className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          <i className="ti ti-plus text-sm" aria-hidden="true" /> Add room
        </button>

        {message && (
          <div className={`flex items-center gap-2 mt-4 px-4 py-3 rounded-xl text-sm border ${
            isError ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"
          }`}>
            <i className={`ti ${isError ? "ti-alert-circle" : "ti-circle-check"} flex-shrink-0`} aria-hidden="true" />
            {message}
          </div>
        )}
      </div>

      <div className="mb-6 pb-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <i className="ti ti-building-community text-gray-400 text-xl" aria-hidden="true" />
          All rooms
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manage your meeting spaces</p>
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-20">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-building text-gray-400 text-xl" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-gray-500">No rooms added yet</p>
          <p className="text-xs text-gray-400 mt-1">Create your first room above</p>
        </div>
      )}

      <div className="flex flex-col gap-3 max-w-3xl">
        {rooms.map((room: any) => {
          const sc = statusConfig[room.status] ?? { label: room.status, className: "bg-gray-100 text-gray-600 border border-gray-200", dot: "bg-gray-400" }
          return (
            <div key={room.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-start gap-4 hover:border-gray-300 transition-colors shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <i className="ti ti-door text-blue-700 text-xl" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 mb-1.5">{room.name}</p>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {room.capacity ? (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <i className="ti ti-users text-xs" aria-hidden="true" />
                      {room.capacity} people
                    </span>
                  ) : null}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${sc.className}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                </div>
                {room.Amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {room.Amenities.map((a: string) => (
                      <span key={a} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-50 text-gray-500 border border-gray-100">
                        <i className={`ti ${AMENITY_ICONS[a] ?? "ti-star"} text-xs`} aria-hidden="true" />
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0 items-center">
                <button onClick={() => delRoom(room.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  <i className="ti ti-trash text-xs" aria-hidden="true" /> Delete
                </button>
                <button onClick={() => { setSelectedRoom(room); setEditName(room.name); setEditCapacity(room.capacity); setEditStatus(room.status); setEditAmenities(room.Amenities) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <i className="ti ti-pencil text-xs" aria-hidden="true" /> Edit
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AddRoom
