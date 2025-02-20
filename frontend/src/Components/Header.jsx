import React from 'react';
import './main.css';
import Logo from './notelogo.png'

const Header = () => {
  return (
    <div className='header'>
      <div className="logo"><img alt="Logo" src={Logo}/> </div>
      <div></div>
    </div>
  )
}

export default Header
