import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./ProfileEdit.css";
import Footer from './Footer';
  
const ProfileEdit = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    profilePic: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedRole = localStorage.getItem('userRole');
        const storedId = localStorage.getItem('userId');

        if (!storedRole || !storedId) {
          throw new Error('Missing userRole or userId in localStorage');
        }

        let url = '';
        if (storedRole === 'foodLover') {
          url = `https://localhost:7242/api/Customer/foodlover/${storedId}`;
        } else if (storedRole === 'chef') {
          url = `https://localhost:7242/api/Chef/chef/${storedId}`;
        } else {
          throw new Error('Invalid role stored in localStorage');
        }

        const response = await axios.get(url);
        const data = response.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          id: data.id,
          name: data.name || '',
          email: data.email || '',
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile details.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        profilePic: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedRole = localStorage.getItem('userRole');
      const storedId = localStorage.getItem('userId');

      if (!storedRole || !storedId) {
        throw new Error('Missing userRole or userId in localStorage');
      }

      let url = '';
      if (storedRole === 'foodLover') {
        url = `https://localhost:7242/api/Customer/foodlover/${storedId}`;
      } else if (storedRole === 'chef') {
        url = `https://localhost:7242/api/Chef/chef/${storedId}`;
      } else {
        throw new Error('Invalid role stored in localStorage');
      }

      const formPayload = new FormData();
      formPayload.append('id', formData.id); // Important to include id
      formPayload.append('name', formData.name);
      formPayload.append('email', formData.email);

      if (formData.profilePic) {
        formPayload.append('profilePic', formData.profilePic);
      }

      await axios.put(url, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handlePasswordChangeClick = () => {
    navigate('/password-change'); // Link to password change page
  };

  return (
    <>
      <div className="profile-edit-container">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Profile Picture:</label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button
              type="button"
              className="password-change-btn"
              onClick={handlePasswordChangeClick}
            >
              Password Change
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ProfileEdit;
