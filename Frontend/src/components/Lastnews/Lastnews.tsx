import React, { useState, useEffect } from 'react';
import NewsCard from '../OneNews/OneNews';
import './LastNews.css';

interface NewsItem {
  urlToImage: string;
  title: string;
  publishedAt: string;
}

// Интерфейс для ответа API
interface ApiResponse {
  articles: NewsItem[];
}


// Главный компонент для рендеринга блока с новостями
const NewsComponent: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]); // явно указываем тип для новостей
  const [loading, setLoading] = useState<boolean>(true); // типизация для состояния загрузки
  const [error, setError] = useState<string | null>(null); // типизация для ошибки

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/news');
        const data: ApiResponse = await response.json();
        setNewsItems(data.articles); // работаем с типизированным массивом
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p>Loading news...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="news-container">
      <h2>Today in the <span className="highlight">news</span></h2>
      <div className="news-grid">
        {newsItems.length > 0 && (
          <div className="featured-news">
            <NewsCard
              image={newsItems[0].urlToImage} // Передаем image как urlToImage
              title={newsItems[0].title}
              time={new Date(newsItems[0].publishedAt).toLocaleTimeString()} // Преобразуем publishedAt в time
              date={new Date(newsItems[0].publishedAt).toLocaleDateString()} // Преобразуем publishedAt в date
            />
          </div>
        )}
        <div className="news-list">
          {newsItems.slice(1).map((item, index) => (
            <NewsCard
              key={index}
              image={item.urlToImage} // Передаем image как urlToImage
              title={item.title}
              time={new Date(item.publishedAt).toLocaleTimeString()} // Преобразуем publishedAt в time
              date={new Date(item.publishedAt).toLocaleDateString()} // Преобразуем publishedAt в date
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsComponent;
