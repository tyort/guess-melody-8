import {isArtistAnswerCorrect} from './game';
import {makeFakeArtistQuestion} from './utils/mocks';

const mockArtistQuestion = makeFakeArtistQuestion();

// Актуальные для функции тесты внутри describe
describe('Function: isArtistAnswerCorrect', () => {

  // в '...' обязанности функции
  it('should return "true" when answer is correct', () => {
    const {artist: correctAnswer} = mockArtistQuestion.song;

    // Когда мы вызываем isArtistAnswerCorrect(mockArtistQuestion, correctAnswer),
    // то результат должен быть "true"
    expect(isArtistAnswerCorrect(mockArtistQuestion, correctAnswer))
      .toBe(true);
  });

  it('should return "false" when answer is incorrect', () => {
    const incorrectAnswer = 'unknown';
    expect(isArtistAnswerCorrect(mockArtistQuestion, incorrectAnswer))
      .toBe(false);
  });
});
