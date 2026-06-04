import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../api/authApi";

    type Props = {
        children: ReactNode;
    };

    export const ProtectedRoute = ({children} : Props) => {
        const [authenticated,setAuthenticated] = useState(false);
        const [loading, setLoading] = useState(true);
        useEffect(() => {
            const fetchUser =  async() => {
                try{                    
                    await getCurrentUser();
                    setAuthenticated(true);
                }
                catch {                    
                    setAuthenticated(false);
                } finally {
                    setLoading(false);
                }
            }
            fetchUser();
        },[])

        if (loading) {
            return <div>Loading...</div>;
        }
    
        if(!authenticated) {            
            return <Navigate to="/" replace/>
        }

        return children
}

