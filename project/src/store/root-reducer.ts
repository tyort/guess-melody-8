import {combineReducers} from 'redux';
import {gameProcess} from './game-process/game-process';
import {gameData} from './game-data/game-data';
import {userProcess} from './user-process/user-process';

export enum NameSpace {
  data = 'DATA',
  game = 'GAME',
  user = 'USER',
}

// combineReducers объединяем редьюсеры
export const rootReducer = combineReducers({
  // [ключ хранилища]: управляем этим редьюсером
  [NameSpace.data]: gameData,
  [NameSpace.game]: gameProcess,
  [NameSpace.user]: userProcess,
});

// Описываем тип корневого редьюсера
export type RootState = ReturnType<typeof rootReducer>;
