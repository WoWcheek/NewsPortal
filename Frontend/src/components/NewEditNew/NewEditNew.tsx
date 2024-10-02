import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NewEditNew.css';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  pictureUrl: string;
  createdAt: string;
  categoryId: string;
  authorId: string;
}

interface Category {
  id: string;
  name: string;
}

const EditNews: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { newsItem } = location.state as { newsItem: NewsItem };

  const [title, setTitle] = useState(newsItem.title);
  const [content, setContent] = useState(newsItem.content);
  const [pictureUrl, setPictureUrl] = useState(newsItem.pictureUrl);
  const [categoryId, setCategoryId] = useState(newsItem.categoryId); // Идентификатор выбранной категории
  const [categories, setCategories] = useState<Category[]>([]); // Список категорий

  useEffect(() => {
    // Функция для получения категорий из API
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://localhost:7101/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCategories(data); // Сохраняем категории в состоянии
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };

    fetchCategories(); // Загружаем категории при монтировании компонента
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    console.log('Токен:', token);

    if (!token) {
      alert('Пожалуйста, войдите в систему');
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert('Поля не могут быть пустыми');
      return;
    }

    try {
      const response = await fetch(`https://localhost:7101/api/articles/${newsItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: newsItem.id,
          title,
          content,
          pictureUrl,
          createdAt: newsItem.createdAt,
          categoryId, // Используем выбранную категорию
        }),
      });

      const contentType = response.headers.get('Content-Type');

      if (response.ok) {
        alert('Новость успешно обновлена');
        navigate(`/news/${newsItem.id}`);
      } else if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.error('Ошибка при сохранении:', errorData);
        alert(`Ошибка при сохранении: ${errorData.message || 'Неизвестная ошибка'}`);
      } else {
        const errorText = await response.text(); // Обработка текстового ответа
        console.error('Ошибка при сохранении (текст):', errorText);
        alert(`Ошибка при сохранении: ${errorText}`);
      }
    } catch (error) {
      console.error('Произошла ошибка при запросе:', error);
      alert('Произошла ошибка при сохранении. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <div className="edit-news-container">
      <h2>Edit</h2>

      <div>
        <label>
          Название новости:
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Введите название"
          />
        </label>
      </div>

      <div>
        <label>
          Контент новости:
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Введите контент"
            rows={6}
          />
        </label>
      </div>

      <div>
        <label>
          URL изображения:
          <input 
            type="text" 
            value={pictureUrl} 
            onChange={(e) => setPictureUrl(e.target.value)} 
            placeholder="Введите URL изображения"
          />
        </label>
      </div>

      <div>
        <label>
          Категория:
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Выберите категорию</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
};

export default EditNews;
