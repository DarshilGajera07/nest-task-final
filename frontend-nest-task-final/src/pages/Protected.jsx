
import { Navigate, Outlet } from 'react-router'

const Protected = () => {
    const authenticated = localStorage.getItem('accessToken') !== null;
  return (
    <>
   {authenticated ? <Outlet /> : <Navigate to="/login" />}
    </>
  )
}

export default Protected

// import React from 'react'

// const Protected = () => {
//   return (
//     <div>Protected</div>
//   )
// }

// export default Protected