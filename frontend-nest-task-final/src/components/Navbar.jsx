import {  Link } from 'react-router'

const Navbar = () => {
  return (
    <>
    <div>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </nav>
    </div>
    </>
  )
}

export default Navbar



