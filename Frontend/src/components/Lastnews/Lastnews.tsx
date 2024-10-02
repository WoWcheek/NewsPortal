import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import NewsCard from '../OneNews/OneNews'; 
import './LastNews.css';
import BigNews from '../BigNews/BigNews';

interface NewsItem {
  id: string;          
  title: string;       
  content: string;    
  pictureUrl: string; 
  createdAt: Date;     
  category: string;   // Название категории в новости
  author: string;      
}

interface Category {
  id: string;  // UUID категории
  name: string;  // Название категории
}

const NewsComponent: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);      
  const [error, setError] = useState<string | null>(null);  
  const [categoryId, setCategoryId] = useState('');  // ID выбранной категории
  const [categories, setCategories] = useState<Category[]>([]);  
  
  const navigate = useNavigate();

  // Получение новостей
  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('Запрашиваем новости...');
        const response = await fetch('https://localhost:7101/api/articles');
        const data: NewsItem[] = await response.json();

        console.log('Новости получены:', data);

        // Сортируем новости по дате создания
        const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setNewsItems(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении новостей:', error);
        setError('Failed to load news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Получение категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Запрашиваем категории...');
        const token = localStorage.getItem('token');
        const response = await fetch('https://localhost:7101/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        console.log('Категории получены:', data);

        setCategories(data);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };

    fetchCategories();
  }, []);

  // Показываем состояние загрузки или ошибку, если они есть
  if (loading) {
    console.log('Загрузка новостей...');
    return <p>Loading news...</p>;
  }

  if (error) {
    console.log('Ошибка:', error);
    return <p>{error}</p>;
  }

  // Находим название выбранной категории по её ID
  const selectedCategoryName = categoryId
    ? categories.find(category => category.id === categoryId)?.name
    : '';

  console.log('Выбранная категория (название):', selectedCategoryName);

  // Фильтруем новости по названию категории
  const filteredNewsItems = selectedCategoryName
    ? newsItems.filter(item => item.category === selectedCategoryName)  // Сравнение с названием категории
    : newsItems;  // Если категория не выбрана, показываем все новости

  console.log('Отфильтрованные новости:', filteredNewsItems);

  // Выделяем избранные и оставшиеся новости
  const featuredNews = filteredNewsItems.slice(0, 5);
  const remainingNews = filteredNewsItems.slice(5);

  // Обработчик для добавления новости
  const handleAddNews = () => {
    console.log('Переход на добавление новостей');
    navigate('/add-news');
  };

  return (
    <div className="news-container">
      <h2>Today in the <span className="highlight">news</span></h2>

      <label>
        Категория:
        <select value={categoryId} onChange={(e) => {
          const newCategoryId = e.target.value;
          setCategoryId(newCategoryId);
          console.log('Выбранная категория (ID):', newCategoryId);
        }}>
          <option value="">Выберите категорию</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <div className="news-grid">
        {featuredNews.length > 0 && (
          <div className="featured-news">
            <BigNews
              id={featuredNews[0].id}
              image={featuredNews[0].pictureUrl}
              title={featuredNews[0].title}
              time={new Date(featuredNews[0].createdAt).toLocaleTimeString()}
              date={new Date(featuredNews[0].createdAt).toLocaleDateString()}
            />
          </div>
        )}
        <div className="news-list">
          {featuredNews.slice(1).map((item) => (
            <NewsCard
              key={item.id}
              id={item.id}
              image={item.pictureUrl}
              title={item.title}
              time={new Date(item.createdAt).toLocaleTimeString()} 
              date={new Date(item.createdAt).toLocaleDateString()} 
            />
          ))}
        </div>
      </div>
      <button className="add-button" onClick={handleAddNews}>+</button>
      <div className='line'></div>
      <h2>And more <span className="highlight">News</span></h2>
      <div className="remaining-news-grid">
        {remainingNews.map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            image={item.pictureUrl}
            title={item.title}
            time={new Date(item.createdAt).toLocaleTimeString()}
            date={new Date(item.createdAt).toLocaleDateString()}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsComponent;
