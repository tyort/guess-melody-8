import {Route, Redirect} from 'react-router-dom';
import {RouteProps} from 'react-router-dom';
import {connect, ConnectedProps} from 'react-redux';
import {History} from 'history'; // импортируем только чтобы указать тип
import {State} from '../../types/state';
import {AppRoute, AuthorizationStatus} from '../../const';
import {getAuthorizationStatus} from '../../store/user-process/selectors';

type RenderFuncProps = {
  history: History<unknown>;
}

type PrivateRouteProps = RouteProps & {
  // от родителя в качестве аргумента должен прийти объект со значение ключа history
  render: (props: RenderFuncProps) => JSX.Element;
  authorizationStatus: AuthorizationStatus;
}

const mapStateToProps = (state: State) => ({
  // getAuthorizationStatus(state) - значение ключа(выбрано под капотом)
  //                                 из нужного стейта(выбрано под капотом)
  authorizationStatus: getAuthorizationStatus(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux & PrivateRouteProps;

function PrivateRoute(props: ConnectedComponentProps): JSX.Element {
  const {exact, path, render, authorizationStatus} = props;

  return (
    <Route
      exact={exact}
      path={path}
      render={(routeProps) => (
        authorizationStatus === AuthorizationStatus.Auth
          ? render(routeProps)
          : <Redirect to={AppRoute.Login} />
      )}
    />
  );
}

export {PrivateRoute};
export default connector(PrivateRoute);
