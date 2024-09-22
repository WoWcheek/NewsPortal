import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BigNews.css';

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
    <div className="news-card-big" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={image} alt={title} className="news-card-image-big" />
      <div className="news-card-content-big">
        <h3 className="name_h3-big">{title}</h3>
        <div className="news-card-footer-big">
          <span className="news-card-time-big">{time}</span>
          <span className="news-card-date-big">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
