import React, { useState, useEffect } from 'react';
import Footer from './Footer';

const PasswordChange = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const id = localStorage.getItem('userId');
    setUserRole(role);
    setUserId(id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('New Password and Confirm Password do not match!');
      return;
    }

    if (!userRole || !userId) {
      alert('User role or ID not found!');
      return;
    }

    let url = '';

    if (userRole === 'foodLover') {
      url = `https://localhost:7242/api/Customer/foodlover/${userId}/change-password`;
    } else if (userRole === 'chef') {
      url = `https://localhost:7242/api/Chef/chef/${userId}/change-password`;
    } else {
      alert('Unknown user role!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: 'PUT', // ✅ Correct method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Number(userId), // send as number
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        alert('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: 'Unknown server error' };
        }
        alert(errorData.message || 'Failed to change password!');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <div className="profile-edit-container">
        <h2>Change Password</h2>
        <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="oldPassword">Old Password</label>
            <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            </div>

            <div className="form-actions">
            <button type="submit" className="password-change-btn" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
            </button>
            </div>
        </form>
        </div>
        <Footer />
    </>
  );
};

export default PasswordChange;
