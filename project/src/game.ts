import {Question, QuestionArtist, QuestionGenre, UserArtistQuestionAnswer, UserGenreQuestionAnswer, UserAnswer} from './types/question';
import {GameType} from './const';

// Более абстрактная функция, которая проверяет корректность ответа для любого вопроса
export const isAnswerCorrect = (question: Question, answer: UserAnswer): boolean => {
  // проверяем свойство type объекта question
  // а также конкретный тип аргумента answer, т.е. string | UserGenreQuestionAnswer не подойдет
  if (question.type === GameType.Artist && typeof answer === 'string') {
    return isArtistAnswerCorrect(question as QuestionArtist, answer);
  }

  if (question.type === GameType.Genre && Array.isArray(answer)) {
    return isGenreAnswerCorrect(question as QuestionGenre, answer);
  }

  throw new Error('Unknown question type');
};

// Проверяет корректность ответа для "угадай исполнителя"
export const isArtistAnswerCorrect = (question: QuestionArtist, userAnswer: UserArtistQuestionAnswer): boolean =>
  userAnswer === question.song.artist;

// Проверяет корректность ответа для "угадай жанр"
export const isGenreAnswerCorrect = (question: QuestionGenre, userAnswer: UserGenreQuestionAnswer): boolean =>
  // массив ответов пользователя, например [false, true, false, false]
  userAnswer.every((answer, index) =>
    // ответ_пользователя === в рамках самого вопроса совпадение по жанру
    answer === (question.answers[index].genre === question.genre));
