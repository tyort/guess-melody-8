import {
  ThunkAction,
  ThunkDispatch
} from 'redux-thunk';
import {
  AxiosInstance
} from 'axios';
import {State} from '../types/state';

import {
  checkUserAnswer,
  incrementStep,
  resetGame,
  loadQuestions,
  requireAuthorization,
  requireLogout
} from '../store/action';

export enum ActionType {
  CheckUserAnswer = 'game/checkUserAnswer',
  IncrementStep = 'game/incrementStep',
  ResetGame = 'game/reset',
  LoadQuestions = 'data/loadQuestions',
  RequireAuthorization = 'user/requireAuthorization',
  RequireLogout = 'user/requireLogout',
}

// ReturnType - получем тип(type), который возвращает функция(action)
export type Actions =
  | ReturnType<typeof checkUserAnswer>
  | ReturnType<typeof incrementStep>
  | ReturnType<typeof resetGame>
  | ReturnType<typeof loadQuestions>
  | ReturnType<typeof requireAuthorization>
  | ReturnType<typeof requireLogout>;


// Создаем новый тип на основании типа(интерфейса) ThunkAction
// По умолчанию поставили R = Promise<void>. Но когда-то нам нужно будет переопределять R ?????
export type ThunkActionResult<R = Promise<void>> = ThunkAction<R, State, AxiosInstance, Actions>;

export type ThunkAppDispatch = ThunkDispatch<State, AxiosInstance, Actions>;
