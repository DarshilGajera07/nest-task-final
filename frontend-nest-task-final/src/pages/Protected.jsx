
import { Navigate, Outlet } from 'react-router'
import Navbar from '../components/Navbar'

const Protected = () => {
    const authenticated = localStorage.getItem('accessToken') !== null;
  return (
    <>
   {authenticated ? <Outlet /> : <Navigate to="/login" />}
    </>
  )
}

export default Protected