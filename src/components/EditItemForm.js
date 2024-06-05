import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemForm.css';
import { Item } from './Item';

const EditItemForm = ({ fetchItems, currentItem, setCurrentItem, setIsModalOpen }) => {
  const [formData, setFormData] = useState({ title: '', description: '', startingBid: '', bidStep: '', startBidTime: '', endBidTime: '', currentBid: '' });
  const [isEditable, setIsEditable] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (currentItem) {
      setFormData({ ...currentItem, currentBid: currentItem.startingBid });
      checkIfEditable(currentItem.endBidTime);
    }
  }, [currentItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      if (name === 'startingBid') {
        return { ...prevFormData, [name]: value, currentBid: value };
      }
      return { ...prevFormData, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditable) return;
    try {
      const config = {
        headers: { Authorization: `${token}` }
      };
      await axios.put(`${process.env.REACT_APP_API_URL}/items/${formData.id}`, formData, config);
      setFormData({ title: '', description: '', startingBid: '', bidStep: '', startBidTime: '', endBidTime: '', currentBid: '' });
      setCurrentItem(null);
      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  const checkIfEditable = (endBidTime) => {
    const currentTime = new Date();
    const newTime = new Date(currentTime.getTime() + 7 * 60 * 60 * 1000)
    const endBidDate = new Date(endBidTime);
    setIsEditable(newTime <= endBidDate);
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <h3>Edit Item</h3>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        autoComplete="off"
        disabled={!isEditable}
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        autoComplete="off"
        disabled={!isEditable}
      />
      <input
        type="number"
        name="startingBid"
        value={formData.startingBid}
        onChange={handleChange}
        placeholder="Starting Bid"
        autoComplete="off"
        disabled={!isEditable}
      />
      <input
        type="number"
        name="bidStep"
        value={formData.bidStep}
        onChange={handleChange}
        placeholder="Bid Step"
        autoComplete="off"
        disabled={!isEditable}
      />
      <input
        type="datetime-local"
        name="startBidTime"
        value={formData.startBidTime}
        onChange={handleChange}
        placeholder="Start Bid Time"
        autoComplete="off"
        disabled={!isEditable}
      />
      <input
        type="datetime-local"
        name="endBidTime"
        value={formData.endBidTime}
        onChange={handleChange}
        placeholder="End Bid Time"
        autoComplete="off"
        disabled={!isEditable}
      />
      <button type="submit" disabled={!isEditable}>Edit Item</button>
    </form>
  );
};

export default EditItemForm;
