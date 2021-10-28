import {ThunkActionResult} from '../types/action';
import {loadQuestions, redirectToRoute, requireAuthorization, requireLogout} from './action';
import {saveToken, dropToken, Token} from '../services/token';
import {APIRoute, AuthorizationStatus, AppRoute} from '../const';
import {Question} from '../types/question';
import {AuthData} from '../types/auth-data';

// Получается fetchQuestionAction поможет вызвать функцию вместо объекта
// Диспатчинг синхронного действия произойдет после асинхронного await
export const fetchQuestionAction = (): ThunkActionResult =>
  // api - аргумент из index.tsx
  async (dispatch, _getState, api): Promise<void> => {
    const {data} = await api.get<Question[]>(APIRoute.Questions);
    dispatch(loadQuestions(data));
  };

export const checkAuthAction = (): ThunkActionResult =>
  async (dispatch, _getState, api) => {
    await api.get(APIRoute.Login)
      .then(() => {
        dispatch(requireAuthorization(AuthorizationStatus.Auth));
      });
  };

export const loginAction = ({login: email, password}: AuthData): ThunkActionResult =>
  async (dispatch, _getState, api) => {
    const {data: {token}} = await api.post<{token: Token}>(APIRoute.Login, {email, password});
    saveToken(token);
    dispatch(requireAuthorization(AuthorizationStatus.Auth));
    dispatch(redirectToRoute(AppRoute.Result));
  };


export const logoutAction = (): ThunkActionResult =>
  async (dispatch, _getState, api) => {
    api.delete(APIRoute.Logout);
    dropToken();
    dispatch(requireLogout());
  };
