import {render, screen} from '@testing-library/react';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import {configureMockStore} from '@jedmao/redux-mock-store';
import {Provider} from 'react-redux';
import userEvent from '@testing-library/user-event';
import AuthScreen from './auth-screen';

const mockStore = configureMockStore();

describe('Component: AuthScreen', () => {
  it('should render "AuthScreen" when user navigate to "login" url', () => {
    const history = createMemoryHistory();
    // адрес не влияет на результат теста
    history.push('/log');

    render(
      // если не обернуть в Provider, то хуки from 'react-redux' будут ругаться
      // store в виде пустого объекта, а именно "{}"
      <Provider store={mockStore({})}>
        <Router history={history}>
          <AuthScreen />
        </Router>
      </Provider>,
    );

    // getBy... - Если этого текста нет, то тест сразу выдаст ошибку
    expect(screen.getByText(/Сыграть ещё раз/i)).toBeInTheDocument();
    expect(screen.getByText(/Хотите узнать свой результат\? Представьтесь!/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Логин/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();

    // Имитация ввода логина и пароля
    userEvent.type(screen.getByTestId('login'), 'keks');
    userEvent.type(screen.getByTestId('password'), '123456');

    // getByDisplayValue - текст в полях ввода
    expect(screen.getByDisplayValue(/keks/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/123456/i)).toBeInTheDocument();
  });
});
