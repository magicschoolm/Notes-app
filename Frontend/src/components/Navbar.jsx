import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  console.log(user)
  return (
    <header className="navbar">
      <nav className="navbar-content" aria-label="Main navigation">
        <span className="navbar-brand">NOTES APP</span>

        {!user ? (<>

          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : undefined}>
            Login
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : undefined}>
            Register
          </NavLink>

        </>) : (<>

          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : undefined}>
            Dashboard
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : undefined}>
            Profile
          </NavLink>
          <button className='button' onClick={logout}>Logout</button>
          <span> welcome {user.username}! </span>

        </>)}
      </nav>
    </header>
  )
}

export default Navbar