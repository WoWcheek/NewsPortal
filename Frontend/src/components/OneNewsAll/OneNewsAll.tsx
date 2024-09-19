import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './OneNewsAll.css';

// Интерфейс для данных новости
interface NewsItem {
  id: string;
  title: string;
  content: string;
  pictureUrl: string;
  createdAt: Date;
  author: string;
  authorAvatarUrl: string; // Добавляем поле для URL аватарки автора
}

// Компонент для отображения детальной страницы новости
const NewsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Получаем ID новости из параметров URL
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Загрузка данных новости с API
    const fetchNewsItem = async () => {
      try {
        const response = await fetch(`https://localhost:7101/api/articles/${id}`);
        const data: NewsItem = await response.json();
        setNewsItem(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load news');
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  // Функция для форматирования времени (пример: "3 часа назад")
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000); // Разница в секундах

    const hours = Math.floor(diff / 3600);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="news-details">
      {newsItem && (
        <>
          <h1>{newsItem.title}</h1>
          <div className="news-meta">
            <div className="author-info">
              {/* URL аватарки автора */}
              <img src="https://cdn-icons-png.flaticon.com/512/3076/3076248.png" alt={newsItem.author} className="author-avatar" />
              <span>{newsItem.author}</span>
              {/* Отображаем сколько времени прошло с момента публикации */}
              <span className="news-time">{timeAgo(newsItem.createdAt)}</span>
              <span className="news-date">{new Date(newsItem.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <img src={newsItem.pictureUrl} alt={newsItem.title} className="news-details-image" />
          <p className="news-content">{newsItem.content}</p>
        </>
      )}
    </div>
  );
};

export default NewsDetails;
