import {Switch, Route, BrowserRouter} from 'react-router-dom';
import {AppRoute, AuthorizationStatus} from '../../const';
import WelcomeScreen from '../welcome-screen/welcome-screen';
import ArtistQuestionScreen from '../artist-question-screen/artist-question-screen';
import GenreQuestionScreen from '../genre-question-screen/genre-question-screen';
import AuthScreen from '../auth-screen/auth-screen';
import GameOverScreen from '../game-over-screen/game-over-screen';
import WinScreen from '../win-screen/win-screen';
import NotFoundScreen from '../not-found-screen/not-found-screen';
import PrivateRoute from '../private-route/private-route';
import {Questions, QuestionGenre} from '../../types/question';

// Названия свойств типа должны совпадать с пропсами родителя
type AppScreenProps = {
  errorsCount: number;
  questions: Questions;
}

function App({errorsCount, questions}: AppScreenProps): JSX.Element {
  // аналогично const {questions} = props
  // questions имеет тип Questions или массив QuestionArtist | QuestionGenre
  // соответственно firstQuestion имеет тип QuestionArtist | QuestionGenre
  const [firstQuestion] = questions;

  return (
    <BrowserRouter>
      {/* Switch позволяет выбирать один из всех Route */}
      <Switch>
        <Route exact path={AppRoute.Root}>
          <WelcomeScreen
            errorsCount={errorsCount}
          />
        </Route>
        <Route exact path={AppRoute.DevArtist}>
          <ArtistQuestionScreen />
        </Route>
        <Route exact path={AppRoute.DevGenre}>
          <GenreQuestionScreen
            // as - явно преобразуем объект к типу
            question={firstQuestion as QuestionGenre}
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
