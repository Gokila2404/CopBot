import { useState, useEffect } from 'react';
import '../styles/profile.css';

interface User {
  name: string;
  email: string;
  phone: string;
  password: string;
  nationalId: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    phone: '',
    password: '',
    nationalId: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // For demo, fetch first user from localStorage
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length > 0) {
      setUser(users[0]);
      setFormData(users[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = () => {
    if (!user) return;
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    users[0] = formData; // Update first user for demo
    localStorage.setItem('users', JSON.stringify(users));
    setUser(formData);
    setEditMode(false);
    setMessage('Profile updated successfully!');
  };

  const handleLogout = () => {
    setUser(null);
    setFormData({ name: '', email: '', phone: '', password: '', nationalId: '' });
    setMessage('Logged out successfully!');
  };

  if (!user) {
    return (
      <div className="profile-container">
        <h2>No User Logged In</h2>
        {message && <p className="message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {message && <p className="message">{message}</p>}

      <div className="profile-card">
        <div className="profile-row">
          <label>Name:</label>
          {editMode ? (
            <input name="name" value={formData.name} onChange={handleChange} />
          ) : (
            <span>{user.name}</span>
          )}
        </div>

        <div className="profile-row">
          <label>Email:</label>
          {editMode ? (
            <input name="email" value={formData.email} onChange={handleChange} />
          ) : (
            <span>{user.email}</span>
          )}
        </div>

        <div className="profile-row">
          <label>Phone:</label>
          {editMode ? (
            <input name="phone" value={formData.phone} onChange={handleChange} />
          ) : (
            <span>{user.phone}</span>
          )}
        </div>

        <div className="profile-row">
          <label>National ID:</label>
          <span>{user.nationalId}</span>
        </div>

        <div className="profile-row">
          <label>Password:</label>
          {editMode ? (
            <input name="password" type="password" value={formData.password} onChange={handleChange} />
          ) : (
            <span>********</span>
          )}
        </div>

        <div className="profile-actions">
          {editMode ? (
            <>
              <button onClick={handleUpdate} className="profile-btn">Save</button>
              <button onClick={() => setEditMode(false)} className="profile-btn cancel">Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="profile-btn">Edit Profile</button>
          )}
          <button onClick={handleLogout} className="profile-btn logout">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
