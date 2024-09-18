import React, { useState, useEffect } from 'react';
import NewsCard from '../OneNews/OneNews'; // Импортируем компонент для отображения отдельной новости
import './LastNews.css';
import BigNews from '../BigNews/BigNews';

// Интерфейс для одного элемента новости, который соответствует ArticleResponse
interface NewsItem {
  id: string;          // ID новости
  title: string;       // Заголовок новости
  content: string;     // Содержимое новости
  pictureUrl: string;  // URL изображения
  createdAt: Date;     // Дата создания
  category: string;    // Категория новости
  author: string;      // Автор новости
}

// Главный компонент для рендеринга блока с новостями
const NewsComponent: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]); // Состояние для новостей
  const [loading, setLoading] = useState<boolean>(true);      // Состояние для загрузки
  const [error, setError] = useState<string | null>(null);    // Состояние для ошибок

  // Вызов useEffect для получения данных при монтировании компонента
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://localhost:7101/api/articles'); // Изменён путь к API
        console.log(response);
        const data: NewsItem[] = await response.json();
        console.log(data);

        // Сортируем новости по дате создания (новейшие — первые)
        const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setNewsItems(sortedData); // Устанавливаем отсортированные статьи в состояние
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []); // Пустой массив, чтобы useEffect сработал только при монтировании

  if (loading) {
    return <p>Loading news...</p>; // Отображаем текст загрузки, пока данные не получены
  }

  if (error) {
    return <p>{error}</p>; // Отображаем ошибку в случае неудачи запроса
  }

  // Выбираем первые 5 новостей, которые будут отображены как основные
  const featuredNews = newsItems.slice(0, 5);
  // Остальные новости будут отображаться ниже в два ряда
  const remainingNews = newsItems.slice(5);

  return (
    <div className="news-container">
      <h2>Today in the <span className="highlight">news</span></h2>
      <div className="news-grid">
        {featuredNews.length > 0 && (
          <div className="featured-news">
            <BigNews
              id={featuredNews[0].id}
              image={featuredNews[0].pictureUrl} // Используем поле pictureUrl вместо urlToImage
              title={featuredNews[0].title}
              time={new Date(featuredNews[0].createdAt).toLocaleTimeString()} // Преобразуем createdAt в time
              date={new Date(featuredNews[0].createdAt).toLocaleDateString()} // Преобразуем createdAt в дату
            />
          </div>
        )}
        <div className="news-list">
          {/* Ограничиваем отображение 4 последних новостей, начиная со второй */}
          {featuredNews.slice(1).map((item) => (
            <NewsCard
              id={item.id} // Используем уникальный идентификатор
              image={item.pictureUrl} // Используем поле pictureUrl вместо urlToImage
              title={item.title}
              time={new Date(item.createdAt).toLocaleTimeString()} // Преобразуем createdAt в time
              date={new Date(item.createdAt).toLocaleDateString()} // Преобразуем createdAt в дату
            />
          ))}
        </div>
      </div>
      <div className='line'></div>
      {/* Добавляем отображение остальных новостей в два ряда */}
      <h2>And more <span className="highlight">News</span></h2>
      <div className="remaining-news-grid">
        {remainingNews.map((item) => (
          <NewsCard
            id={item.id} // Используем уникальный идентификатор
            image={item.pictureUrl} // Используем поле pictureUrl вместо urlToImage
            title={item.title}
            time={new Date(item.createdAt).toLocaleTimeString()} // Преобразуем createdAt в time
            date={new Date(item.createdAt).toLocaleDateString()} // Преобразуем createdAt в дату
          />
        ))}
      </div>
    </div>
  );
};

export default NewsComponent;
