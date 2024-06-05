import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ItemList } from './Item';
import './Auction.css';

const Auction = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/items`);
      setItems(data);
    } catch (error) {
      console.error(error);
    }
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
    <div className="auction-container">
      <h2>Аукцион</h2>
      <ItemList
        items={items}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Auction;
