import {
  ActionType,
  IncrementMistakeAction,
  IncrementStepAction,
  ResetGameAction
} from '../types/action';

// IncrementMistakeAction - тип возвращаемого объекта
export const incrementMistake = (count: number): IncrementMistakeAction => ({
  type: ActionType.IncrementMistake, // имя действия
  payload: count,
});

export const incrementStep = (): IncrementStepAction => ({
  type: ActionType.IncrementStep,
});

export const resetGame = (): ResetGameAction => ({
  type: ActionType.ResetGame,
});
