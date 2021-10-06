import {Route, Redirect} from 'react-router-dom';
import {RouteProps} from 'react-router-dom'; // предоставляет служебные пропсы
import {AppRoute, AuthorizationStatus} from '../../const';

type PrivateRouteProps = RouteProps & {
  // изменяем некоторые пропсы
  render: () => JSX.Element;
  authorizationStatus: AuthorizationStatus;
}

// обертка над "Route"
function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const {exact, path, render, authorizationStatus} = props;

  return (
    <Route
      exact={exact}
      path={path}

      // Здесь мы переопределяем render
      render={() => (
        authorizationStatus === AuthorizationStatus.Auth
          ? render()
          : <Redirect to={AppRoute.Login} />
      )}
    />
  );
}

export default PrivateRoute;
