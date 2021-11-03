import {createReducer} from '@reduxjs/toolkit';
import {GameData} from '../../types/state';
import {loadQuestions} from '../action';

const initialState: GameData = {
  questions: [],
  isDataLoaded: false,
};

// builder - объект с методами, которые позволят описать условия (case)
// без применения оператора switch. Для создания нового условия (кейса) есть метод addCase.
const gameData = createReducer(initialState, (builder) => {
  builder
    // loadQuestions - функция, с помощью которой создаётся действие. НЕ РЕЗУЛЬТАТ выполнения
    // (под капотом)loadQuestions.toString() - Какое действие создаёт функция
    .addCase(loadQuestions, (state, action) => {
      const {questions} = action.payload;

      state.questions = questions;
      state.isDataLoaded = true;
    });
});

export {gameData};
