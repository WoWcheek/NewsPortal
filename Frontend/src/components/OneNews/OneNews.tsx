import React from 'react';
import './OneNews.css'; // импортируем стили для карточки

// Интерфейс для свойств компонента NewsCard
interface NewsCardProps {
  image: string;
  title: string;
  time: string;
  date: string;
}

// Компонент для рендеринга отдельной карточки новости
const NewsCard: React.FC<NewsCardProps> = ({ image, title, time, date }) => {
  return (
    <div className="news-card">
      <img src={image} alt={title} className="news-card-image" />
      <div className="news-card-content">
        <h3>{title}</h3>
        <div className="news-card-footer">
          <span className="news-card-time">{time}</span>
          <span className="news-card-date">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
