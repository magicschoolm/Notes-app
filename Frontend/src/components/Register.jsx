import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"


const Register = () => {
  const [ username, setUsername ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ contact, setContact ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ error, setError ] = useState("")
  const [ profileImage, setProfileImage ] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const formData = new FormData()
    formData.append("username", username)
    formData.append("email", email)
    formData.append("contact", contact)
    formData.append("password", password)
    if (profileImage) {
    formData.append("profile_image", profileImage)
  }
  try {
    await axios.post("http://localhost:5000/api/auth/register", formData, {
      withCredentials: true,
    })
    navigate("/login")
  } catch (error) {
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);
    setError(error.response?.data?.message || error.response?.data?.error || "Registration failed")
  }
}
  return (
    <div className="form-container">
      <div className='form-card'>
        <h4 className='form-title'>Create your account</h4>
        {error && <p className='error' role="alert">{error}</p>}
        <form className='form-group' onSubmit={handleSubmit}>
          <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" required />
          <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
          <input type='tel' placeholder='Contact (optional)' value={contact} onChange={(e) => setContact(e.target.value)} className= "form-input" />
          <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
          <input type='file' accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} className='form-file' />
          <button className='form-button' type="submit">Register</button>
          <p>Already have an account? <Link to = {"/login"}>sign in</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Register