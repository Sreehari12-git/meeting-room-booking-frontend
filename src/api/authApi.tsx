import api from "./axios"

export const loginUser = async(email : string,password:string) => {
    try {
        const response = await api.post("/auth/login", {
            email,
            password
        })
        console.log("Logged in user", response);
        
        return response.data;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

export const logoutUser = async() => {
    return await api.post("/auth/logout");
}

export const getCurrentUser = async() => {
    return await api.get("/auth/me");
}

