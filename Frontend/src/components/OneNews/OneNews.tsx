import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OneNews.css';

interface NewsCardProps {
  id: string;
  image: string;
  title: string;
  time: string;
  date: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ id, image, title, time, date }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/news/${id}`);
  };

  return (
    <div className="news-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={image} alt={title} className="news-card-image" />
      <div className="news-card-content">
        <h3 className="name_h3">{title}</h3>
        <div className="news-card-footer">
          <span className="news-card-time">{time}</span>
          <span className="news-card-date">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
