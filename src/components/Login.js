import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ItemList } from './Item';
import { Link } from 'react-router-dom';
import AddItemForm from './AddItemForm';
import { jwtDecode } from 'jwt-decode';
import './ItemForm.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState([]);
  const [wonItems, setWonItems] = useState([]); // State for won items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // State to manage the visibility of the add form

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const usname = decodedToken?.username;

  const initialFormState = {
    username: '',
    password: ''
  };

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = token ? jwtDecode(token) : null;
      const userId = decodedToken?.userId;
      
      const wonData = {
        userId: userId,
      };
      // Fetch user's items
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/items/user/${userId}`);
      setItems(response.data);

      // Fetch won items
      const wonResponse = await axios.get(`${process.env.REACT_APP_API_URL}/items/won/${userId}`, wonData);
      setWonItems(wonResponse.data);

      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.isAdmin);
      fetchItems();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, formData);
      localStorage.setItem('token', response.data);
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(response.data);
      setIsAdmin(decodedToken.isAdmin);
      fetchItems();
      setFormData(initialFormState);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` }
    };
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/items/${id}`, config);
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h2>{usname}</h2>
      {!isLoggedIn ? (
        <>
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
            <button type="submit" className="item-form-button">Login</button>
          </form>
          <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>
            <div>
              <span>У вас ещё нет аккаунта?</span>
              <span> Зарегистрируйтесь</span>
            </div>
          </Link>
        </>
      ) : (
        <>
          <button onClick={handleLogout} className="item-form-button">Выйти</button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="item-form-button ml-10">
            {showAddForm ? 'Скрыть форму' : 'Добавить предмет'}
          </button>
          {showAddForm && <AddItemForm fetchItems={fetchItems} />}
          <div className='auction-container'>
            <h2>Ваши предметы</h2>
            <ItemList items={items} />
            <h2>Выигранные предметы</h2>
            <ItemList items={wonItems} /> {/* Render won items */}
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
