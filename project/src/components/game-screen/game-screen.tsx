import {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {AppRoute, GameType, FIRST_GAME_STEP} from '../../const';
import ArtistQuestionScreen from '../artist-question-screen/artist-question-screen';
import GenreQuestionScreen from '../genre-question-screen/genre-question-screen';
import {QuestionArtist, QuestionGenre, Questions} from '../../types/question';

type GameScreenProps = {
  questions: Questions;
};

function GameScreen({questions}: GameScreenProps): JSX.Element {
  const [step, setStep] = useState(FIRST_GAME_STEP);

  // Выбираем вопрос под нужным индексом
  const question = questions[step];

  // Если шаг не существует
  if (step >= questions.length || !question) {
    return (
      <Redirect to={AppRoute.Root} />
    );
  }

  // Прорисовываем компонент в зависимости от типа
  switch (question.type) {
    case GameType.Artist:
      return (
        <ArtistQuestionScreen
          key={step}
          question={question as QuestionArtist}
          onAnswer={() => setStep((prevStep) => prevStep + 1)}
        />
      );
    case GameType.Genre:
      return (
        <GenreQuestionScreen
          key={step}
          question={question as QuestionGenre}
          onAnswer={() => setStep((prevStep) => prevStep + 1)}
        />
      );
    default:
      return <Redirect to={AppRoute.Root} />;
  }
}

export default GameScreen;
