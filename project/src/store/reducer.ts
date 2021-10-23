import {isAnswerCorrect} from '../game';
import {ActionType, Actions} from '../types/action';
import {State} from '../types/state';
import {FIRST_GAME_STEP} from '../const';

const initialState = {
  mistakes: 0,
  step: FIRST_GAME_STEP,
};

const STEP_COUNT = 1;

// state = {mistakes: 0, step: 0} --- по умолчанию
const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ActionType.IncrementStep:
      return {...state, step: state.step + STEP_COUNT};
    case ActionType.CheckUserAnswer: {
      const {question, userAnswer} = action.payload;
      // Мы меняем boolean за счет "!" на противоположное, а потом превращаем в число 0 или 1
      return {...state, mistakes: state.mistakes += Number(!isAnswerCorrect(question, userAnswer))};
    }
    case ActionType.ResetGame:
      return {...initialState};
    default:
      return state;
  }
};

export {reducer};
