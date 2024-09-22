import React from 'react';
import './Down.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Левая колонка с логотипом и навигацией */}
        <div className="footer-column">
          <ul className="footer-nav">
            <li><a href="#">About us</a></li>
            <li><a href="#">Contacts</a></li>
            <li><a href="#">News blog</a></li>
          </ul>
        </div>

        {/* Центральная колонка с политикой сайта */}
        <div className="footer-column">
          <ul className="footer-nav">
          <h3 className="footer-logo">V.V.V.<span className="highlight">News</span></h3>
            <li><a href="#">Term of sale</a></li>
            <li><a href="#">Privacy policy</a></li>
            <li><a href="#">Term of use</a></li>
            <li><a href="#">Current policy</a></li>
          </ul>
        </div>

        {/* Правая колонка с кнопками загрузки */}
        <div className="footer-column footer-column-download">
          <a href="#" className="download-btn google-play">
            <span>Завантажити в</span> Google Play
          </a>
          <a href="#" className="download-btn app-store">
            <span>Завантажити в</span> App Store
          </a>
        </div>
      </div>

      {/* Нижний блок с копирайтом */}
      <div className="footer-bottom">
        <p>&copy; V.V.V.News 2024</p>
        <p>Усі права захищені</p>
      </div>
    </footer>
  );
};

export default Footer;
