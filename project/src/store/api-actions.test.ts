import {Action} from 'redux';
import thunk, {ThunkDispatch} from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import {configureMockStore} from '@jedmao/redux-mock-store';
import {createAPI} from '../services/api';
import {checkAuthAction, loginAction, fetchQuestionAction, logoutAction} from './api-actions';
import {APIRoute, AppRoute, AuthorizationStatus} from '../const';
import {State} from '../types/state';
import {requireAuthorization, redirectToRoute, loadQuestions, requireLogout} from './action';
import {AuthData} from '../types/auth-data';
import {makeFakeGenreQuestion, makeFakeArtistQuestion} from '../utils/mocks';

describe('Async actions', () => {
  // onFakeUnauthorized() -- вместо "()=>store.dispatch(requireAuthorization(AuthorizationStatus.NoAuth))"
  // jest.fn() - генерирует фэйковую функцию. Мы могли бы использовать простую функцию, но jest нам дает полезные API
  const onFakeUnauthorized = jest.fn();

  // createAPI - настоящая, onFakeUnauthorized() - не настоящая(см. выше)
  // api - реальный экземпляр axios
  const api = createAPI(onFakeUnauthorized());

  // Замокаем api
  const mockAPI = new MockAdapter(api);
  const middlewares = [thunk.withExtraArgument(api)];

  const mockStore = configureMockStore<
      State,
      Action,
      ThunkDispatch<State, typeof api, Action>
    >(middlewares);

  // Если мы авторизованы, то получаем код 200
  it('should authorization status is «auth» when server return 200', async () => {
    const store = mockStore();
    mockAPI
      .onGet(APIRoute.Login) // когда у на будет запрос GET от клиента по адресу ../login...
      .reply(200, []); // ...тогда мы, как сервер, должны ответить кодом 200 и вернуть пустой массив

    expect(store.getActions()).toEqual([]); // подтверждает, что никаких действий не было

    await store.dispatch(checkAuthAction());

    expect(store.getActions()).toEqual([
      // результат - это какой действие произошло и с каким payload, чтобы изменить хранилище,
      // Т.е. действие - это следствие того, что сервер нам ответил с кодом 200
      requireAuthorization(AuthorizationStatus.Auth),
    ]);
  });

  it('should dispatch RequriedAuthorization and RedirectToRoute when POST /login', async () => {
    const fakeUser: AuthData = {login: 'test@test.ru', password: '123456'};
    mockAPI
      .onPost(APIRoute.Login) // при обращении клиента к axios методом POST
      .reply(200, {token: 'secret'}); // ответим кодом 200 и вернем тело ответа

    const store = mockStore();

    // вместо LocalStorage используем Storage(Node.js), Добавляем свойство setItem
    // Без лишнего кода выполняет реальную работу нашего LocalStorage
    Storage.prototype.setItem = jest.fn();

    await store.dispatch(loginAction(fakeUser));

    expect(store.getActions()).toEqual([
      // должны убедиться, что диспатчится 2 действия, при указанном сценарии с mockAPI
      requireAuthorization(AuthorizationStatus.Auth),
      redirectToRoute(AppRoute.Result),
    ]);

    // Storage.prototype.setItem вместо localStorage.setItem

    // проверка на единоразовый вызов, как раз здесь нам помог API jest.fn()
    expect(Storage.prototype.setItem).toBeCalledTimes(1);

    // проверяем с какими аргументами была вызвана функция
    // похоже на localStorage.setItem(AUTH_TOKEN_KEY_NAME, token)
    expect(Storage.prototype.setItem).toBeCalledWith('guess-melody-token', 'secret');
  });

  it('should dispatch Load_Questions when GET /questions', async () => {
    const mockQuestions = [makeFakeArtistQuestion(), makeFakeGenreQuestion()];
    mockAPI
      .onGet(APIRoute.Questions)
      .reply(200, mockQuestions);

    const store = mockStore();
    await store.dispatch(fetchQuestionAction());

    expect(store.getActions()).toEqual([
      loadQuestions(mockQuestions),
    ]);
  });

  it('should dispatch Logout when Delete /logout', async () => {
    mockAPI
      .onDelete(APIRoute.Logout)
      .reply(204);

    const store = mockStore();
    Storage.prototype.removeItem = jest.fn();

    await store.dispatch(logoutAction());

    expect(store.getActions()).toEqual([requireLogout()]);
    expect(Storage.prototype.removeItem).toBeCalledTimes(1);
    expect(Storage.prototype.removeItem).toBeCalledWith('guess-melody-token');
  });
});
