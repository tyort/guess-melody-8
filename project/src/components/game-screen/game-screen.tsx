import {Redirect} from 'react-router-dom';
import {Dispatch} from 'redux';
import {connect, ConnectedProps} from 'react-redux';
import {checkUserAnswer, incrementStep} from '../../store/action';
import {AppRoute, GameType, MAX_MISTAKE_COUNT} from '../../const';
import {State} from '../../types/state';
import {Actions} from '../../types/action';
import ArtistQuestionScreen from '../artist-question-screen/artist-question-screen';
import GenreQuestionScreen from '../genre-question-screen/genre-question-screen';
import Mistakes from '../mistakes/mistakes';
import {QuestionArtist, QuestionGenre, Question, UserAnswer} from '../../types/question';
import withAudioPlayer from '../../hocs/with-audio-player/with-audio-player';

// При прорисовке этих двух компонентов, нам не надо в пропсах передавать renderPlayer,
// В HOC используем состояние, а также объявляем колбэк, изменяющий это состояние
// В самом HOC создадим пропс renderPlayer для обернутых компонентов
const ArtistQuestionScreenWrapped = withAudioPlayer(ArtistQuestionScreen);
const GenreQuestionScreenWrapped = withAudioPlayer(GenreQuestionScreen);

const mapStateToProps = ({GAME, DATA}: State) => ({
  step: GAME.step,
  mistakes: GAME.mistakes,
  questions: DATA.questions,
});

// Эта функция передаёт в компонент методы для обновления необходимого поля store.
const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  onUserAnswer(question: Question, userAnswer: UserAnswer) {
    // метод dispatch обновляет store
    dispatch(incrementStep());
    dispatch(checkUserAnswer(question, userAnswer));
  },
});

// Мы можем использовать метод connect, потому что подключили <Provider store = {store}>
// связывает mapStateToProps и mapDispatchToProps с компонентом и передает необходимые поля и методы в него.
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function GameScreen(props: PropsFromRedux): JSX.Element {
  const {questions, step, onUserAnswer, mistakes} = props;
  const question = questions[step];

  if (mistakes >= MAX_MISTAKE_COUNT) {
    return (
      <Redirect to={AppRoute.Lose} />
    );
  }

  if (step >= questions.length || !question) {
    return (
      <Redirect to={AppRoute.Result} />
    );
  }

  // Прорисовываем компонент в зависимости от типа
  switch (question.type) {
    case GameType.Artist:
      return (
        <ArtistQuestionScreenWrapped
          key={step}
          question={question as QuestionArtist}
          onAnswer={onUserAnswer}
        >
          <Mistakes count={mistakes} />
        </ArtistQuestionScreenWrapped>
      );
    case GameType.Genre:
      return (
        <GenreQuestionScreenWrapped
          key={step}
          question={question as QuestionGenre}
          onAnswer={onUserAnswer}
        >
          <Mistakes count={mistakes} />
        </GenreQuestionScreenWrapped>
      );
    default:
      return <Redirect to={AppRoute.Root} />;
  }
}

export {GameScreen};
// Возвращает она новый компонент-обёртку для вашего компонента.
export default connector(GameScreen);
