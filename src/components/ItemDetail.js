import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import EditItemForm from './EditItemForm';
import './ItemDetail.css';
import './Item.css';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [currentBid, setCurrentBid] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const isAdmin = decodedToken?.isAdmin;
  const userId = decodedToken?.userId;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/items/${id}`);
        setItem(data);
        setCurrentBid(data.currentBid); // Устанавливаем начальное значение currentBid
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    const config = {
      headers: { Authorization: `${token}` }
    };
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/items/${id}`, config);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleBidChange = (e) => {
    setCurrentBid(e.target.value);
  };

  const handleUpdateBid = async () => {
    if (currentBid.trim() === '') {
      return; // Если поле пустое, не отправляем запрос
    }
  
    const newBid = parseFloat(currentBid);
  
    if (newBid < item.currentBid + item.bidStep) {
      // Если новая ставка меньше чем currentBid + bidStep, сбрасываем поле ввода до текущей ставки
      setCurrentBid(item.currentBid.toFixed(2)); // Фиксируем до двух знаков после запятой
      return;
    }
  
    const config = {
      headers: { Authorization: `${token}` }
    };
  
    try {
      const updatedItem = { 
        ...item,
        currentBid: newBid,     
        win_id: userId
      };

      const bidData = {
        bid: newBid,
        bidDate: new Date().toISOString(),
        user_id: userId,
        item_id: item.id
      };
    
      await axios.post(`${process.env.REACT_APP_API_URL}/transacHists`, bidData, config);
      
      await axios.put(`${process.env.REACT_APP_API_URL}/items/${item.id}`, updatedItem, config);
      setItem(updatedItem);
    } catch (error) {
      console.error(error);
    }
  };
  
  

  const increaseBid = () => {
    setCurrentBid((prevBid) => (parseFloat(prevBid) + item.bidStep).toFixed(2));
  };

  const decreaseBid = () => {
    setCurrentBid((prevBid) => (parseFloat(prevBid) - item.bidStep).toFixed(2));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading item details</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  const currentTime = new Date();
  console.log(currentTime);
  const newTime = new Date(currentTime.getTime() + 7 * 60 * 60 * 1000)
  const endBidTime = new Date(item.endBidTime);
  console.log(endBidTime);
  const canEdit = newTime <= endBidTime;
  const imageUrl = `${process.env.REACT_APP_API_URL}/static/images/${item.imagePath}`;

  return (
    <div className="item-detail">
      <h3 className="item-title">{item.title}</h3>
      <div className="item-detail-content">
        <img src={imageUrl} alt={item.title} className="item-detail-image" />
        <div className="item-detail-info">
          <p>{item.description}</p>
          <p>Current Bid: <span style={{ fontWeight: 'bold' }}>${item.currentBid}</span></p>
          <p>Start Bid Time: {formatDate(item.startBidTime)}</p>
          <p>End Bid Time: {formatDate(item.endBidTime)}</p>
        </div>
      </div>
      <div className="item-detail-buttons">
        {(isAdmin || userId === item.user_id) && (
          <button className='item_button' onClick={handleDelete}>Удалить</button>
        )}
        {(isAdmin || userId === item.user_id) && canEdit && (
          <button className='item_button' onClick={handleEdit}>Изменить</button>
        )}
      </div>
      {canEdit && (
        <div className="update-bid">
          <button className="bid-button" onClick={decreaseBid}>-</button>
          <input
            type="number"
            placeholder="Update Bid"
            value={currentBid}
            onChange={handleBidChange}
          />
          <button className="bid-button" onClick={increaseBid}>+</button>
          <button className='item_button' onClick={handleUpdateBid}>Update Bid</button>
        </div>
      )}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditItemForm
              fetchItems={() => setItem(null)}
              currentItem={item}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
