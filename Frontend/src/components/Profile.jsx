import React, { useState, useEffect } from 'react'
import profileImage from "../assets/demo_profile_image.jpg";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [profileImageFile, setProfileImageFile] = useState(null)

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/me",
        { withCredentials: true }
      );
      setUser(response.data);
    } catch (err) {
      console.log(err)
      setError("failed to fetch user data")
    }
  }
  useEffect(() => {
    fetchUser();
  }, []);
 
  const handleImageUpload = async () => {
    if (!profileImageFile) return

    const formData = new FormData()
    formData.append("profile_image", profileImageFile)
    setError("")

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/upload-profile-image",
        formData,
        { withCredentials: true }
      )
      setUser({ ...user, profile_image: response.data.profile_image })
      setProfileImageFile(null)
    } catch (err) {
      console.log(err);
      setError("failed to upload image")
    }
  }

  if (!user && !error) {
    return <div>Loading...</div>
  }
  if (!user) {
    return <div className="error" role="alert">{error}</div>
  }

  return (
    <div className="profile-container">
      <section className="profile-card" aria-labelledby="profile-title">
        <h1 className="profile-title" id="profile-title">Your profile</h1>
        <div className="profile-overview">
          <img className="profile-avatar" src={user.profile_image ? `http://localhost:5000${user.profile_image}` : profileImage} alt="Profile" />
          <dl className="profile-details">
            <div className="profile-detail">
              <dt>Username</dt>
              <dd>{user.username}</dd>
            </div>
            <div className="profile-detail">
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="profile-detail">
              <dt>Contact</dt>
              <dd>{user.contact || "N/A"}</dd>
            </div>
          </dl>
        </div>
        <div className="profile-upload">
          {error && <p className="error" role="alert">{error}</p>}
          <input id="profile-image" type="file" accept="image/jpeg,image/png" className="form-file" onChange={(e) => setProfileImageFile(e.target.files[0] || null)} />
          {profileImageFile && <button onClick={handleImageUpload} className="form-button" type="button">Upload profile image</button>}
        </div>
      </section>
    </div>
  )
}

export default Profile