import browserHistory from '../../browser-history';
import {Middleware} from 'redux';
import {State} from '../../types/state';
import {ActionType} from '../../types/action';

export const redirect: Middleware<unknown, State> =
  (_store) =>
    (next) =>
      (action) => {

        if (action.type === ActionType.RedirectToRoute) {
          browserHistory.push(action.payload);
        }

        // Здесь(перед next) можно использовать "действия" и "состояние" до изменения состояния "редьюсером"

        const result = next(action); // передаём action следующему middleware.

        // Здесь(после next) уже действие обработано редьюсером и мы имеем актуальный стейт

        return result;
      };
