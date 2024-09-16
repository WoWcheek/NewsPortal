import React, { FC } from 'react';
import logo from '../../image/logo_homepage.png';
import globus from '../../image/Globus.png';
import logining from '../../image/autor.png';
import './Topmenu.css';

interface TopmenuProps {}

const Topmenu: FC<TopmenuProps> = () => (
  <div className='centralB'>
    <div className='imagesdiv'>
      <img src={globus} className='item'></img>
      <img src={logo} className='item'></img>
      <img src={logining} className='item'></img>
    </div>

    <div className='stroke'></div>
  </div>
);

export default Topmenu;
