import React, { useState, useMemo } from "react";
import { UserContext } from "../Hooks/UserContext";
import { BrowserRouter, Switch } from 'react-router-dom';
import { AddPurchaseOrder, Login } from '../Components';
import { createBrowserHistory } from 'history';

import PublicRoute from '../Hooks/PublicRoute';
import PrivateRoute from '../Hooks/PrivateRoute';

const history = createBrowserHistory();
function AppRouter() {
  const [user, setUser] = useState(null);

  const value: any = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (

    <BrowserRouter>
      <UserContext.Provider value={value}>
        <Switch>
          <PublicRoute component={AddPurchaseOrder} path="/create-order" exact />
          <PublicRoute component={Login} path="/" exact />
        </Switch>

      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default AppRouter;