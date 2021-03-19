import React, { useEffect, useState } from 'react'
import { Navbar } from 'react-bootstrap'
//import { logout, isLogin } from '../Middleware/Auth';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

const Header: React.FC = (props): JSX.Element => {
    const [state, setState] = useState(false)

    // useEffect(() => setState(isLogin()), [props])

    const handleLogout = () => {
        // logout();
        // setState(false)
    }

    return (
        <header>

            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <a className="navbar-brand" href="#">React With Typescript</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/" >Login</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/create-order" >Add Order</Link>
                        </li>
                    </ul>
                    <form className="form-inline mt-2 mt-md-0">
                        <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </div>
            </nav>
        </header>


    )
}

export default Header