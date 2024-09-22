import React, { FC, useState } from 'react';
import globus from '../../image/Globus.png';
import logining from '../../image/autor.png';
import logo_autor from '../../image/autorisation_mage.png';
import './Topmenu.css';

interface TopmenuProps {}

const Topmenu: FC<TopmenuProps> = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [nickname, setNickname] = useState(''); 
  const [password, setPassword] = useState(''); 

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Nickname:', nickname);
    console.log('Password:', password);

    handleCloseModal();
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
            
            <img src={logo_autor} alt="Logo" className="modal-logo" />
            
            <form onSubmit={handleLoginSubmit}>
              <input 
                type="text" 
                className="modal-input" 
                placeholder="Введите имя пользователя" 
                value={nickname} 
                onChange={(e) => setNickname(e.target.value)} 
                required
              />
              <input 
                type="password" 
                className="modal-input" 
                placeholder="Введите пароль" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
              
              <button type="submit" className="modal-button">Login</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topmenu;
