import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Добавляем useNavigate
import './OneNewsAll.css';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  pictureUrl: string;
  createdAt: Date;
  author: string;
  authorAvatarUrl: string;
}

const NewsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Получаем ID новости из URL
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Хук для навигации

  useEffect(() => {
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

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

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

  // Обработчик для перехода на страницу редактирования
  const handleEditClick = () => {
    if (newsItem) {
      // Переход на страницу редактирования с передачей id новости
      navigate(`/edit/${newsItem.id}`, { state: { newsItem } });
    }
  };

  // Обработчик удаления новости
  const handleDeleteClick = async () => {
    const confirmed = window.confirm("Вы уверены, что хотите удалить эту новость?");
    if (!confirmed) return;

    const token = localStorage.getItem('token'); // Получаем токен из локального хранилища

    if (!token) {
      alert("Необходимо войти в систему для выполнения этого действия");
      return;
    }

    try {
      const response = await fetch(`https://localhost:7101/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Новость успешно удалена");
        navigate('/'); // Перенаправляем на главную страницу после удаления
      } else {
        const errorData = await response.json();
        alert(`Ошибка при удалении: ${errorData.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Произошла ошибка при запросе:', error);
      alert('Произошла ошибка при удалении. Пожалуйста, попробуйте снова.');
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
          <div className="button-group">
            <button onClick={handleEditClick} className="edit-button">Редактировать</button>
            <button onClick={handleDeleteClick} className="delete-button">Удалить</button> {/* Кнопка удаления */}
          </div>
          <div className="news-meta">
            <div className="author-info">
              <img src="https://cdn-icons-png.flaticon.com/512/3076/3076248.png" alt={newsItem.author} className="author-avatar" />
              <span>{newsItem.author}</span>
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
