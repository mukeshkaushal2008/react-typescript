import React from 'react';
import { isLogin } from '../Middlewares/Auth';
import {
    Route,
    Redirect,
    RouteProps,
} from 'react-router-dom';
interface PrivateRouteProps extends RouteProps {
    // tslint:disable-next-line:no-any
    component: React.ComponentType<any>;
    exact?: boolean;
    path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = (props): JSX.Element => {
    const { component: Component, exact,path, ...rest } = props;
  
    return (
        <Route
            {...rest}
            render={(routeProps): JSX.Element =>
                isLogin() ? (
                    <Component {...routeProps} />
                ) : (
                        <Redirect
                            to={{
                                pathname: '/',
                                state: { from: routeProps.location }
                            }}
                        />
                    )
            }
        />
    );
}
export default PrivateRoute;