import {configureMockStore} from '@jedmao/redux-mock-store';
import {AnyAction} from 'redux';
import {redirect} from './redirect';
import {redirectToRoute} from '../action';
import {AppRoute} from '../../const';
import {State} from '../../types/state';

// фековая аналогия browserHistory
const fakeHistory = {
  location: {pathname: ''},
  push(path: string) {
    this.location.pathname = path;
  },
};

// 1-ый аргумент: модуль, который мы хотим замокать;
// 2-ой аругмент: колбэк, который возвращает
// объект(аналогия с реальным browserHistory из browser-history);
jest.mock('../../browser-history', () => fakeHistory);
const middlewares = [redirect];
const mockStore = configureMockStore<State, AnyAction>(middlewares);

// сконфигурированное фейковое хранилище
const store = mockStore();

describe('Middleware: redirect', () => {
  beforeEach(() => {
    // очищаем историю перед каждым тестом ниже
    fakeHistory.push('');
  });

  it('should be redirect to /login', () => {

    // действие перенаправления на ../login
    store.dispatch(redirectToRoute(AppRoute.Login));

    // В файле redirect.ts вместо browserHistory.push будет fakeHistory.push.
    // В итоге после диспатча fakeHistory.location.pathname === '/login'
    expect(fakeHistory.location.pathname).toBe(AppRoute.Login);

    // Должны удостовериться, что было действие redirectToRoute(AppRoute.Login)
    // store.getActions() === [{type: 'game/redirectToRoute', payload: '/login'}] === [redirectToRoute(AppRoute.Login)]
    expect(store.getActions()).toEqual([
      redirectToRoute(AppRoute.Login),
    ]);
  });
  it('should not to be redirect /lose because bad action', () => {
    // Надо проверить, что редирект не работает на других действиях

    // Если мы диспатчим непонятное действие, в нагрузку передаем реальный путь...
    store.dispatch({type: 'UNKNOWN_ACTION', payload: AppRoute.Lose});

    // ...то мы в данном случае не должны перейти по пути AppRoute.Lose
    expect(fakeHistory.location.pathname).not.toBe(AppRoute.Lose);
  });
});
