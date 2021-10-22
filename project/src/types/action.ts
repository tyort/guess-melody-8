// enum используется для перечислений
export enum ActionType {
  IncrementMistake = 'game/incrementMistake',
  IncrementStep = 'game/incrementStep',
  ResetGame = 'game/reset',
}

// Ниже представлены типы возвращаемых значений функций Action
export type IncrementMistakeAction = {
  type: ActionType.IncrementMistake;
  payload: number;
};

export type IncrementStepAction = {
  type: ActionType.IncrementStep;
};

export type ResetGameAction = {
  type: ActionType.ResetGame;
};

export type Actions = IncrementMistakeAction | IncrementStepAction | ResetGameAction;
