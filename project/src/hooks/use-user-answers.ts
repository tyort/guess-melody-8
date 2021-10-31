import {useState} from 'react';
import {QuestionGenre, UserGenreQuestionAnswer} from '../types/question';

type AnswerCallback = (question: QuestionGenre, answers: UserGenreQuestionAnswer) => void;
type ResultUserAnswers = [boolean[], () => void, (id: number, value: boolean) => void];

export const useUserAnswers = (question: QuestionGenre, onAnswer: AnswerCallback): ResultUserAnswers => {
  const answersCount = question.answers.length;
  const [answers, setAnswers] = useState<boolean[]>(new Array(answersCount).fill(false));

  // 1) этот колбэк вызывается в компоненте, где был установлен хук useUserAnswers
  // 2) Вызов handleAnswer -> Вызов onAnswer(question, answers) -> Вызов у родителя onUserAnswer
  // 3) onUserAnswer метод mapDispatchToProps -> диспатчим действие
  const handleAnswer = () => {
    onAnswer(question, answers);
  };

  // функция для запуска setAnswers
  const handleAnswerChange = (id: number, value: boolean) => {
    const userAnswers = answers.slice(0);
    userAnswers[id] = value;
    setAnswers(userAnswers);
  };

  return [answers, handleAnswer, handleAnswerChange];
};
