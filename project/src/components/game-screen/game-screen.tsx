import {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {AppRoute, GameType, FIRST_GAME_STEP} from '../../const';
import ArtistQuestionScreen from '../artist-question-screen/artist-question-screen';
import GenreQuestionScreen from '../genre-question-screen/genre-question-screen';
import {QuestionArtist, QuestionGenre, Questions} from '../../types/question';
import withAudioPlayer from '../../hocs/with-audio-player/with-audio-player';

// При прорисовке этих двух компонентов, нам не надо в пропсах передавать renderPlayer,
// В HOC используем состояние, а также объявляем колбэк, изменяющий это состояние
// В самом HOC создадим пропс renderPlayer для обернутых компонентов
const ArtistQuestionScreenWrapped = withAudioPlayer(ArtistQuestionScreen);
const GenreQuestionScreenWrapped = withAudioPlayer(GenreQuestionScreen);

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
        <ArtistQuestionScreenWrapped
          key={step}
          question={question as QuestionArtist}

          // ф-ия для обновления setStep принимает новую ф-ию;
          // prevStep - текущее значение состояния
          onAnswer={(vopros, artist) => {
            // eslint-disable-next-line no-console
            console.log(vopros);
            // eslint-disable-next-line no-console
            console.log(artist);
            setStep((prevStep) => prevStep + 1);
          }}
        />
      );
    case GameType.Genre:
      return (
        <GenreQuestionScreenWrapped
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
