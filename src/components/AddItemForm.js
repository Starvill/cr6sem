import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import './ItemForm.css';

const AddItemForm = ({fetchItems}) => {
  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken?.userId;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [currentBid, setCurrentBid] = useState('');
  const [bidStep, setBidStep] = useState('');
  const [startBidTime, setStartBidTime] = useState('');
  const [endBidTime, setEndBidTime] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('startingBid', startingBid);
      formData.append('currentBid', startingBid);
      formData.append('bidStep', bidStep);
      formData.append('startBidTime', startBidTime);
      formData.append('endBidTime', endBidTime);
      formData.append('image', image);
      formData.append('user_id', userId);

      const config = {
        headers: { Authorization: `${token}` }
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/items`, formData, config);

      // Reset the form fields
      setTitle('');
      setDescription('');
      setStartingBid('');
      setStartBidTime('');
      setEndBidTime('');
      setCurrentBid('');
      setBidStep('');
      setImage(null);
      if (fetchItems) {
        fetchItems();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!token) return null;

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <h3>Add New Item</h3>
      <input
        type="text"
        value={title}
        autoComplete="off"
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        type="text"
        value={description}
        autoComplete="off"
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="number"
        value={startingBid}
        autoComplete="off"
        onChange={(e) => setStartingBid(e.target.value)}
        placeholder="Starting Bid"
        required
      />
      <input
        type="number"
        value={bidStep}
        autoComplete="off"
        onChange={(e) => setBidStep(e.target.value)}
        placeholder="Bid Step"
        required
      />
      <input
        type="datetime-local"
        value={startBidTime}
        autoComplete="off"
        onChange={(e) => setStartBidTime(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={endBidTime}
        autoComplete="off"
        onChange={(e) => setEndBidTime(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItemForm;
