import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({isAuthenticated, children}) => {

    if (!isAuthenticated) {
        // navigation
        return <Navigate to='/' replace/>;
    }
    return children;

   

//   return (
//     <div>ProtectedRoute</div>
//   )
}

export default ProtectedRoute