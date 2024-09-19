import React, { FC, useState } from 'react';
import globus from '../../image/Globus.png';
import logining from '../../image/autor.png';
import logo_autor from '../../image/autorisation_mage.png'
import './Topmenu.css';

interface TopmenuProps {}

const Topmenu: FC<TopmenuProps> = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className='centralB'>
      <div className='imagesdiv'>
        <img src={globus} className='item' alt="Globus" />
        <h3 className="footer-logo"><span className="highlight">News</span></h3>
        <img 
          src={logining} 
          className='item' 
          alt="Login"
          onClick={handleOpenModal} 
        />
      </div>

      <div className='stroke'></div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            
            {/* Логотип */}
            <img src={logo_autor} alt="Logo" className="modal-logo" />
            
            {/* Поле ввода */}
            <input type="email" className="modal-input" placeholder="Введите Email"/>
            
            {/* Кнопка */}
            <button className="modal-button">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topmenu;
