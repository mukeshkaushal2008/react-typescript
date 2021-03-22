import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  let pathname = window.location.pathname;
  useEffect(() => {
    pathname = window.location.pathname;
  }, [window.location.pathname]);

  return (
    <>
      <li className={`nav-item ${pathname.startsWith('/') ? 'active' : ''}`}>
        <Link to="/" className="nav-link" >Login</Link>
      </li>

      <li className={`nav-item ${pathname.startsWith('/create-order') ? 'active' : ''}`}>
        <Link to="/create-order" className="nav-link" >Create Order</Link>
      </li>

      <li className={`nav-item ${pathname.startsWith('/users') ? 'active' : ''}`}>
        <Link to="/users" className="nav-link" >Users</Link>
      </li>


    </>
  );
}

export default NavBar;