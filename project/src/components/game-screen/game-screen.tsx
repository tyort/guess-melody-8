import {Redirect} from 'react-router-dom';
import {Dispatch} from 'redux';
import {connect, ConnectedProps} from 'react-redux';
import {checkUserAnswer, incrementStep} from '../../store/action';
import {AppRoute, GameType} from '../../const';
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

const mapStateToProps = ({step, mistakes, questions}: State) => ({
  step,
  mistakes,
  questions,
});

// Без использования bindActionCreators
const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  onUserAnswer(question: Question, userAnswer: UserAnswer) {
    dispatch(incrementStep());
    dispatch(checkUserAnswer(question, userAnswer));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function GameScreen(props: PropsFromRedux): JSX.Element {
  const {questions, step, onUserAnswer, mistakes} = props;
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
export default connector(GameScreen);
