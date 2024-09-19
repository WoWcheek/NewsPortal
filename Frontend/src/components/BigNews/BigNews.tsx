import React from 'react';
import { useNavigate } from 'react-router-dom'; // Используем для навигации
import './BigNews.css'; // импортируем стили для карточки

// Интерфейс для свойств компонента NewsCard
interface NewsCardProps {
  id: string;  // Добавляем id для перехода на конкретную новость
  image: string;
  title: string;
  time: string;
  date: string;
}

// Компонент для рендеринга отдельной карточки новости
const NewsCard: React.FC<NewsCardProps> = ({ id, image, title, time, date }) => {
  const navigate = useNavigate(); // Используем useNavigate для перехода

  // Функция для обработки клика на карточку
  const handleClick = () => {
    navigate(`/news/${id}`); // Переход на страницу новости с указанным id
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
