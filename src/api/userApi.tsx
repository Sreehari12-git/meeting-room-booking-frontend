import api from "./axios"

export const createUser = async(name:string,password:string,email:string,role:string) => {
    try {
        const response = await api.post("/admin/create-user", {
            name,
            password,
            email,
            role
        })
        return response;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

export const deleteUser = async(email:string) => {
    try {
            const response = await api.delete(`/admin/user/${email}`);
            return response;
        }
    catch(error) {
            console.log(error);
            throw error;
    }
}

export const getAllUsers = async() => {
    try {
        const response = await api.get("/admin/get-all");
        return response;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

export const updateUser = async(email:string, data: any) => {
    try {
        const response = await api.put(`admin/user/${email}`, data)
        return response;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

