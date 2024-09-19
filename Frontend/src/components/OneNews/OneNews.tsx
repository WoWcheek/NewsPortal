import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OneNews.css';

// Интерфейс для свойств компонента NewsCard
interface NewsCardProps {
  id: string; // ID новости, чтобы на него сделать переход
  image: string;
  title: string;
  time: string;
  date: string;
}

// Компонент для рендеринга отдельной карточки новости
const NewsCard: React.FC<NewsCardProps> = ({ id, image, title, time, date }) => {
  const navigate = useNavigate(); // Используем useNavigate вместо useHistory

  // Функция для обработки клика на карточку
  const handleClick = () => {
    // Переходим на страницу новости по ее ID
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
