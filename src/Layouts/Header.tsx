import React, { useContext, useEffect, useState } from 'react'
import { Navbar, Spinner } from 'react-bootstrap'
//import { logout, isLogin } from '../Middleware/Auth';
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../Hooks/UserContext";
import { useHistory } from "react-router-dom";
import { logout } from '../Actions/UserAction';
import { useDispatch, useSelector, connect } from 'react-redux';
import { AppState } from '../Store';
import { success, error } from '../Utils/Toaster';
import { clearToken } from '../Middlewares/Auth';
import NavBar from '../Layouts/NavBar';

const Header: React.FC = (props): JSX.Element => {
    const dispatch = useDispatch();
    let history = useHistory();  // declare here, inside a React component. 

    const [isLoggedIn, setIsLoggedIn] = useState<string>('');
    const userContext: any = useContext(UserContext);
    const response: any = useSelector((state: AppState) => state.UserReducer);
    const [logoutLoader, setLogoutLoader] = useState<boolean>(false);

    // useEffect(() => setState(isLogin()), [props])
    useEffect(() => {
        console.log(userContext.isLoggedIn);
        setIsLoggedIn(userContext.isLoggedIn);
    }, []);
    const handleLogout = (): void => {
        setLogoutLoader(true);
        dispatch(logout());
    }
    useEffect((): void => {
        if (response && response.payload && response.payload.status == 200) {
            setLogoutLoader(false);
            if (response.action == "LOGOUT") {

                clearToken();
                success('You are logged out successfully');
                history.push("/");
            }
        }

        if (response && response.payload && response.payload.isAxiosError) {
            setLogoutLoader(false);
            if (response.payload.response && response.payload.response.data.status != 200) {
                error(response.payload.response.data.message);
                console.log('Component error', response)
            }
        }

    }, [response]);
    return (
        <header>

            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <a className="navbar-brand" href="#">React With Typescript</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav mr-auto">
                        <NavBar />
                    </ul>
                    {/* <form className="form-inline mt-2 mt-md-0">
                        <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form> */}


                    {isLoggedIn && <button onClick={handleLogout} disabled={(logoutLoader) ? true : false} className="btn btn-outline-success my-2 my-sm-0" type="button">
                        {logoutLoader && <Spinner animation="border" size="sm" />}
                        {(logoutLoader) ? 'Processing' : 'Logout'}
                    </button>}
                </div>
            </nav>
        </header>


    )
}

export default Header