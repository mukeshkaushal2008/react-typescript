import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { isLogin } from '../Middlewares/Auth';


interface PublicRouteProps extends RouteProps {
    // tslint:disable-next-line:no-any
    component: React.ComponentType<any>;
    exact?: boolean;
    path: string;
    restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = (props): JSX.Element => {
    const { component: Component, exact, path, restricted, ...rest } = props;
    return (
        <Route
            {...rest}
            render={(routeProps): JSX.Element =>
                isLogin() && restricted ? (
                    <Redirect to="/users" />
                ) : (
                    <Component {...props} />
                )
            }
        />
    );
}


export default PublicRoute;