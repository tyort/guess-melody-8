import {renderHook, act} from '@testing-library/react-hooks';
import {useUserAnswers} from './use-user-answers';
import {makeFakeGenreQuestion} from '../utils/mocks';

const fakeQuestionGenre = makeFakeGenreQuestion();

describe('Hook: useUserAnswers', () => {

  it('should return array with 3 elements', () => {
    const {result} = renderHook(() =>
      useUserAnswers(fakeQuestionGenre, jest.fn()),
    );

    const [answers, handleAnswer, handleAnswerChange] = result.current;

    expect(result.current).toHaveLength(3);
    expect(answers).toBeInstanceOf(Array);
    expect(handleAnswer).toBeInstanceOf(Function);
    expect(handleAnswerChange).toBeInstanceOf(Function);
  });

  // корректное изменение состояния
  it('should be correctly change state', () => {
    const expectedInitialAnswers = [false, false, false, false];
    const {result} = renderHook(
      () => useUserAnswers(fakeQuestionGenre, jest.fn()),
    );

    // initialAnswers должен соответствовать expectedInitialAnswers
    const [initialAnswers] = result.current;
    let [,, handleAnswerChange] = result.current;

    // асинхронную функцию оборачиваем в act
    // handleAnswerChange - имитируем ответ пользователя
    act(() => handleAnswerChange(1, true));

    // Дублируем эту строчку, т.к. после act хук перерендеривается,
    // нам нужен новый handleAnswerChange
    [,, handleAnswerChange] = result.current;
    act(() => handleAnswerChange(3, true));

    const [answers] = result.current;
    expect(initialAnswers).toStrictEqual(expectedInitialAnswers);
    expect(answers[1]).toBe(true);
    expect(answers[3]).toBe(true);
  });

  it('should be call onAnswer', () => {
    const onAnswer = jest.fn();
    const {result} = renderHook(() =>
      useUserAnswers(fakeQuestionGenre, onAnswer),
    );
    const [answers, handleAnswer] = result.current;
    handleAnswer();

    // вызван однократно
    expect(onAnswer).toBeCalled();
    expect(onAnswer).toHaveReturnedWith(void 0);

    // с какими параметрами был вызван
    expect(onAnswer).toHaveBeenCalledWith(fakeQuestionGenre, answers);
  });
});
