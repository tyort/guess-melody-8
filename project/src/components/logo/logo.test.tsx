import {render, screen} from '@testing-library/react';
import {Router as BrowserRouter, Switch, Route} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import Logo from './logo';
import userEvent from '@testing-library/user-event';

const history = createMemoryHistory();

describe('Component: Logo', () => {
  it('should render correctly', () => {
    render(
      // BrowserRouter - этот компонент нужен, т.к. без него не отрендерится <Logo />
      // Потому что внутри <Logo /> используется Link(для него еще нужен объект history)
      <BrowserRouter history={history}>
        <Logo />
      </BrowserRouter>);

    // screen - олицетворяет пользовательский экран
    expect(screen.getByAltText(/Угадай мелодию/i)).toBeInTheDocument();

    // Найдем элемент по роли
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('should redirect to root url when user clicked to link', () => {
    // компонент <Logo /> отрендерится при любом маршруте
    history.push('/fake');

    render(
      <BrowserRouter history={history}>
        <Switch>
          <Route path="/" exact>
            <h1>This is main page</h1>
          </Route>
          <Route>
            <Logo />
          </Route>
        </Switch>
      </BrowserRouter>);

    // getByAltText вместо queryByText выкинул бы ошибку
    expect(screen.queryByText(/This is main page/i)).not.toBeInTheDocument();

    // имитация пользовательских событий
    userEvent.click(screen.getByRole('link'));
    expect(screen.queryByText(/This is main page/i)).toBeInTheDocument();
  });
});
