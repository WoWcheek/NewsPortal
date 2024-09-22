import React, { useState, useEffect } from 'react';
import NewsCard from '../OneNews/OneNews'; 
import './LastNews.css';
import BigNews from '../BigNews/BigNews';

interface NewsItem {
  id: string;          
  title: string;       
  content: string;    
  pictureUrl: string;  
  createdAt: Date;     
  category: string;   
  author: string;      
}


const NewsComponent: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);      
  const [error, setError] = useState<string | null>(null);    

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://localhost:7101/api/articles');
        console.log(response);
        const data: NewsItem[] = await response.json();
        console.log(data);

        const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setNewsItems(sortedData);
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

  const featuredNews = newsItems.slice(0, 5);

  const remainingNews = newsItems.slice(5);

  return (
    <div className="news-container">
      <h2>Today in the <span className="highlight">news</span></h2>
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
              id={item.id}
              image={item.pictureUrl}
              title={item.title}
              time={new Date(item.createdAt).toLocaleTimeString()} 
              date={new Date(item.createdAt).toLocaleDateString()} 
            />
          ))}
        </div>
      </div>
      <div className='line'></div>
      <h2>And more <span className="highlight">News</span></h2>
      <div className="remaining-news-grid">
        {remainingNews.map((item) => (
          <NewsCard
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
