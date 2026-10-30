// import React from 'react'
import { Link } from 'react-router-dom'
import { AuthContext,  } from '../context/AuthContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from "react";

const Login = () => {
  const [ username, setUsername ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ error, setError ] = useState("")
  const navigate = useNavigate()

  const {user, loading, login} = useContext(AuthContext)
  
  const handleLogin = async (e) => {
    e.preventDefault()
    const sucess = await login({
      username,
      password
    })
    if (sucess) {
        navigate("/dashboard")
    } else {
      setError("Login failed. Check your username and password and try again.")
    }
  }

  if (loading) {
    return <div> Loading...</div>
  }
  return (
    <div className="form-container">
      <div className='form-card login-card'>
        <h4 className='form-title'>Welcome back</h4>
        {error && <p className='error'>{error}</p>}
        <div className='form-group'>
          <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}  className= "form-input" />
          <input type='password' placeholder='password'  value={password} onChange={(e) => setPassword(e.target.value)} className= "form-input" />
          <button className="form-button" onClick={handleLogin}>Login</button>
          <p>Dont have an account? <Link to = {"/register"}>sign up</Link></p>
        </div>
      </div>
    </div>
  )
}
export default Login