import api from "./axios";

export const checkAvailability = async(startTime : string, endTime: string) => {
    const response = await api.post("/booking/check-availability", {
        startTime,endTime
    })
    return response.data;
}

export const bookRoom = async(roomId: number,startTime: string, endTime: string) => {
    const response = await api.post("/booking/book-room", {
        roomId, startTime, endTime
    })
    return response.data;
}

export const getUpcomingBookings = async() => {
    const response = await api.get("/booking/upcoming");
    return response.data;
}

export const getBookingHistory = async () => {
    const response = await api.get("/booking/history");
    return response.data;
};

export const cancelBooking = async (bookingId: number) => {
    const response = await api.put(`/booking/${bookingId}`);
    return response.data;
};

export const getAllBookings = async() => {
    const response = await api.get("/booking/all-bookings");
    return response.data;
}

