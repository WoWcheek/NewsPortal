import React, { useState, useEffect, FC } from 'react';
import "./AddNewsPage.css";
interface Category {
  id: string;
  name: string;
}

interface AddNewsPageProps {}

const AddNewsPage: FC<AddNewsPageProps> = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]); // Состояние для категорий

  useEffect(() => {
    // Функция для загрузки категорий из API
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token'); // Получаем токен из localStorage

        const response = await fetch('https://localhost:7101/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок запроса
          },
        });

        const data = await response.json();
        setCategories(data); // Сохраняем полученные категории в состоянии
      } catch (error) {
        console.error('Failed to load categories:', error);
        alert('Error loading categories');
      }
    };

    fetchCategories(); // Загружаем категории при монтировании компонента
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newsData = {
      title,
      content,
      pictureUrl,
      categoryId,
    };

    try {
      const token = localStorage.getItem('token'); // Получаем токен из localStorage

      const response = await fetch('https://localhost:7101/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок запроса
        },
        body: JSON.stringify(newsData),
      });

      if (response.ok) {
        alert('News successfully added!');
        // Очищаем поля после успешной отправки
        setTitle('');
        setContent('');
        setPictureUrl('');
        setCategoryId('');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert('Error adding news.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add news. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add a News Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>

        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content"
            rows={5}
            required
          />
        </div>

        <div>
          <label>Picture URL:</label>
          <input
            type="text"
            value={pictureUrl}
            onChange={(e) => setPictureUrl(e.target.value)}
            placeholder="Enter picture URL"
            required
          />
        </div>

        <div>
          <label>Category:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddNewsPage;
