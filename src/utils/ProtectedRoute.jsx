import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext';

const ProtectedRoute = ({ children }) => {

    const {isAuthenticated}  = useAuth();

    if (!isAuthenticated) {
        // navigation
        return <Navigate to='/' replace />;
    }
    return children;



    //   return (
    //     <div>ProtectedRoute</div>
    //   )
}

export default ProtectedRoute