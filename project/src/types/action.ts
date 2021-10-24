import {
  checkUserAnswer,
  incrementStep,
  resetGame,
  loadQuestions
} from '../store/action';

export enum ActionType {
  CheckUserAnswer = 'game/checkUserAnswer',
  IncrementStep = 'game/incrementStep',
  ResetGame = 'game/reset',
  LoadQuestions = 'data/loadQuestions',
}

// ReturnType - получем тип(type), который возвращает функция(action)
export type Actions =
  | ReturnType<typeof checkUserAnswer>
  | ReturnType<typeof incrementStep>
  | ReturnType<typeof resetGame>
  | ReturnType<typeof loadQuestions>;
