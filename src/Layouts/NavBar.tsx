import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from "../Hooks/UserContext";

const NavBar: React.FC = (): JSX.Element => {
  const isLoggedIn: boolean = useContext(UserContext);

  let pathname = window.location.pathname;
  useEffect(() => {
    pathname = window.location.pathname;
  }, [window.location.pathname]);

  return (
    <>
      <li className={`nav-item ${pathname.startsWith('/') ? 'active' : ''}`}>
        <Link to="/login" className="nav-link" >Login</Link>
      </li>

      {isLoggedIn && <li className={`nav-item ${pathname.startsWith('/create-order') ? 'active' : ''}`}>
        <Link to="/create-order" className="nav-link" >Create Order</Link>
      </li>
      }

      {isLoggedIn && <li className={`nav-item ${pathname.startsWith('/users') ? 'active' : ''}`}>
        <Link to="/users" className="nav-link" >Users</Link>
      </li>
      }


    </>
  );
}

export default NavBar;