import React from 'react';
import { Link } from 'react-router-dom';
import './Item.css';

const Item = ({ item }) => {
  const formatDate = (dateString) => {
    let formattedString = dateString.replace('T', ' ').replace('Z', '');
    formattedString = formattedString.split('.')[0];
    return formattedString;
  };

  const currentTime = new Date();
  const endBidTime = new Date(item.endBidTime);
  const canEdit = currentTime <= endBidTime;

  const imageUrl = `${process.env.REACT_APP_API_URL}/static/images/${item.imagePath}`;
  console.log(item.startBidTime);
  return (
    <div className="item">
      <img src={imageUrl} alt={item.title} className="item-image" />
      <div className="item-details">
        <h2 className="item-title">Лот №: {item.id}</h2>
        <p className="item-title">{item.title}</p>
        <p className="item-description">Описание: {item.description}</p>
        <p className="item-bid">Текущая ставка Bid: <span>${item.currentBid}</span></p>
        <p className="item-time">Начало аукциона: {formatDate(item.startBidTime)}</p>
        <p className="item-time">Конец аукциона: {formatDate(item.endBidTime)}</p>
        {!canEdit && <p className="auction-ended-message">Аукцион закрыт. Время истекло</p>}
        <Link to={`/item/${item.id}`} className="item-button-link">
          <button className="item-button">Подробнее</button>
        </Link>
      </div>
    </div>
  );
};

const ItemList = ({ items }) => {
  return (
    <div className="item-list-container">
      <ul className="item-list">
        {items.map(item => (
          <li key={item.id} className="item-list-element">
            <Item item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export { Item, ItemList };