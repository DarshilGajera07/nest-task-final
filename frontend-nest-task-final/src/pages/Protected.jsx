
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