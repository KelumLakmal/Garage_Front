import { jwtDecode } from 'jwt-decode';
import React, { useContext } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react'

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [permissions, setPermissions] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            const decodeToken = jwtDecode(token);
            setUser(JSON.parse(userData));
            setPermissions(decodeToken.permission);
        }
        console.log("Workss");
    }, []);

    const logIn = (data) => {
        const decodeToken = jwtDecode(data.token);
        console.log("Tokendata", decodeToken);
        setPermissions(decodeToken.permission);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
    }

    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }

     const hasPermission = (permission) => {
        return permissions?.includes(permission)
    }

    // const hasPermission = (permission) => {
    //     return user?.permissions?.includes(permission);
    // }

    return (
        <AuthContext.Provider
            value={{
                user,
                logIn,
                logOut,
                hasPermission,
                isAuthenticated: !!user,
                permissions
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
