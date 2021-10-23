import {Switch, Route, BrowserRouter} from 'react-router-dom';
import {AppRoute, AuthorizationStatus, MAX_MISTAKE_COUNT} from '../../const';
import WelcomeScreen from '../welcome-screen/welcome-screen';
import AuthScreen from '../auth-screen/auth-screen';
import GameOverScreen from '../game-over-screen/game-over-screen';
import WinScreen from '../win-screen/win-screen';
import NotFoundScreen from '../not-found-screen/not-found-screen';
import PrivateRoute from '../private-route/private-route';
import GameScreen from '../game-screen/game-screen';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      {/* Switch позволяет выбирать один из всех Route */}
      <Switch>
        <Route exact path={AppRoute.Root}>
          <WelcomeScreen
            errorsCount={MAX_MISTAKE_COUNT}
          />
        </Route>
        <Route exact path={AppRoute.Login}>
          <AuthScreen />
        </Route>
        <PrivateRoute
          exact
          path={AppRoute.Result}
          render={() => <WinScreen />}
          authorizationStatus={AuthorizationStatus.NoAuth}
        >
        </PrivateRoute>
        <Route exact path={AppRoute.Lose}>
          <GameOverScreen />
        </Route>
        <Route exact path={AppRoute.Game}>
          <GameScreen />
        </Route>
        <Route>
          <NotFoundScreen />
          {/*
            render={(props) => {
              console.log(`404 props`, props); можно увидеть служебные пропсы
              return (
                <Fragment>
                  <h1>
                    404.
                    <br />
                    <small>Page not found</small>
                  </h1>
                  <Link to="/">Go to main page</Link>
                </Fragment>
              );
            }}
          */}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
