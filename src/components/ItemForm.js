import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemForm.css'; // Импортируем файл стилей

const ItemForm = ({ fetchItems, currentItem, setCurrentItem }) => {
  const [formData, setFormData] = useState({ title: '', description: '', startingBid: '' });
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (currentItem) {
      setFormData(currentItem);
    }
  }, [currentItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization:`${token}` }
      };
      if (formData.id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/items/${formData.id}`, formData, config);
      }
      setFormData({ title: '', description: '', startingBid: '' });
      setCurrentItem(null);
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  if (!token) return null;

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        autoComplete="off"
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        autoComplete="off"
      />
      <input
        type="number"
        name="startingBid"
        value={formData.startingBid}
        onChange={handleChange}
        placeholder="Starting Bid"
        autoComplete="off"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ItemForm;
