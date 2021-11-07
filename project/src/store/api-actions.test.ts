import {Action} from 'redux';
import thunk, {ThunkDispatch} from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import {configureMockStore} from '@jedmao/redux-mock-store';
import {createAPI} from '../services/api';
import {checkAuthAction} from './api-actions';
import {APIRoute, AuthorizationStatus} from '../const';
import {State} from '../types/state';
import {requireAuthorization} from './action';

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

  it('should authorization status is «auth» when server return 200', async () => {
    const store = mockStore();
    mockAPI
      .onGet(APIRoute.Login) // когда у на будет запрос по адресу ../login...
      .reply(200, []); // ...тогда мы, как сервер, должны ответить кодом 200 и вернуть пустой массив

    expect(store.getActions()).toEqual([]); // подтверждает, что никаких действий не было

    await store.dispatch(checkAuthAction());

    expect(store.getActions()).toEqual([
      // резултат - это какой действие произошло и с каким payload
      requireAuthorization(AuthorizationStatus.Auth),
    ]);
  });
});
