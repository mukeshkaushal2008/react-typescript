import React, { useState, useEffect } from "react";
import { UserContext } from "../Hooks/UserContext";
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { AddPurchaseOrder, Login, Users } from '../Components';

import PublicRoute from '../Hooks/PublicRoute';
import PrivateRoute from '../Hooks/PrivateRoute';
import { createBrowserHistory } from 'history';
import { useSelector } from 'react-redux';
import { AppState } from '../Store';

const history = createBrowserHistory();

const AppRouter: React.FC = (): JSX.Element => {
  const response: any = useSelector((state: AppState) => state.UserReducer);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect((): void => {
    if (response && response.isLoggedIn !== undefined) {
        setIsLoggedIn(response.isLoggedIn);
    }
}, [response.isLoggedIn]);

  return (

    <Router history={history}>
      <UserContext.Provider value={isLoggedIn}>
        <Switch>
          <PrivateRoute component={AddPurchaseOrder} path="/create-order" exact />
          <PrivateRoute component={Users} path="/users" exact />
          <PublicRoute restricted={true} component={Login} path="/login" exact />
          <Route path="/" render={() => <Redirect to={'/login'} />} exact />
        </Switch>

      </UserContext.Provider>
    </Router>
  );
}

export default AppRouter;