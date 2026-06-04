import api from "./axios"

export const createRoom = async(name:string, status: string, capacity:number, amenities: string[]) => {
    try {
        const response = await api.post("/admin/create-rooms", {
            name,status,capacity,amenities
        });
        return response;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

export const getRooms = async() => {
    try {
        const response = await api.get("/admin/get-rooms");
        return response;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

export const deleteRoom = async(name: string) => {
    try {
        const response = await api.delete(`/admin/room/${name}`);
        return response;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

export const updateRoom = async(name:string, data: any) => {
    try {
        const response = await api.put(`/admin/room/${name}`, data);
        return response;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

