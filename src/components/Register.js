import React, { useState } from 'react';
import axios from 'axios';
import './ItemForm.css'; // Используем стили из ItemForm

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="item-form">
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          placeholder="Username"
          className="item-form-input"
        />
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Password"
          className="item-form-input"
        />
        <button type="submit" className="item-form-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
