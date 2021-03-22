import React, { useState, useMemo } from "react";
import { UserContext } from "../Hooks/UserContext";
import { Router, Switch } from 'react-router-dom';
import { AddPurchaseOrder, Login, Users } from '../Components';

import PublicRoute from '../Hooks/PublicRoute';
import PrivateRoute from '../Hooks/PrivateRoute';
import { createBrowserHistory } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../Store';
import { getToken } from '../Middlewares/Auth';

const history = createBrowserHistory();

const AppRouter: React.FC = (): JSX.Element => {
  const [loggedinUser, setLoggedinUser] = useState(null);
  //const value: any = useMemo(() => ({ loggedinUser, setLoggedinUser }), [loggedinUser, setLoggedinUser]);
  const value: any = { isLoggedIn: getToken() }
  return (

    <Router history={history}>
      <UserContext.Provider value={value}>
        <Switch>
          <PrivateRoute component={AddPurchaseOrder} path="/create-order" exact />
          <PrivateRoute component={Users} path="/users" exact />
          <PublicRoute restricted={true} component={Login} path="/" exact />
        </Switch>

      </UserContext.Provider>
    </Router>
  );
}

export default AppRouter;