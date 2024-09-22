import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NewEditNew.css'; // Импорт стилей

interface NewsItem {
  id: string;
  title: string;
  content: string;
}

const EditNews: React.FC = () => {
  const location = useLocation();  // Получаем переданные данные о новости
  const navigate = useNavigate();
  
  const { newsItem } = location.state as { newsItem: NewsItem };

  const [title, setTitle] = useState(newsItem.title);
  const [content, setContent] = useState(newsItem.content);

  const handleSave = async () => {
    const response = await fetch(`https://localhost:7101/api/articles/${newsItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    if (response.ok) {
      alert('Новость успешно обновлена');
      navigate(`/news/${newsItem.id}`);
    } else {
      alert('Ошибка при сохранении');
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

      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
};

export default EditNews;
