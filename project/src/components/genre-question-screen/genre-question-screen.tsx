import {FormEvent, ChangeEvent, PropsWithChildren} from 'react';
import Logo from '../logo/logo';
import {useUserAnswers} from '../../hooks/use-user-answers';
import {QuestionGenre, UserGenreQuestionAnswer} from '../../types/question';

type GenreQuestionScreenProps = PropsWithChildren<{
  question: QuestionGenre;
  // Функция ничего не возвращает
  onAnswer: (question: QuestionGenre, answers: UserGenreQuestionAnswer) => void;
  renderPlayer: (src: string, playerIndex: number) => JSX.Element;
}>;

function GenreQuestionScreen(props: GenreQuestionScreenProps): JSX.Element {
  const {question, onAnswer, renderPlayer, children} = props;
  const {answers, genre} = question;

  // Этот hook помог нам избавится от состояния в этом компоненте
  const [userAnswers, handleAnswer, handleAnswerChange] = useUserAnswers(question, onAnswer);

  return (
    <section className="game game--genre">
      <header className="game__header">
        <Logo />

        <svg xmlns="http://www.w3.org/2000/svg" className="timer" viewBox="0 0 780 780">
          <circle className="timer__line" cx="390" cy="390" r="370"
            style={{filter: 'url(#blur)', transform: 'rotate(-90deg) scaleY(-1)', transformOrigin: 'center'}}
          />
        </svg>

        {children}
      </header>

      <section className="game__screen">
        <h2 className="game__title">Выберите {genre} треки</h2>
        <form
          className="game__tracks"
          onSubmit={(evt: FormEvent<HTMLFormElement>) => {
            evt.preventDefault();
            // возвращает хук для диспатча действия
            handleAnswer();
          }}
        >
          {answers.map((answer, id) => {
            const keyValue = `${id}-${answer.src}`;
            return (
              <div key={keyValue} className="track">
                {renderPlayer(answer.src, id)}
                <div className="game__answer">
                  <input className="game__input visually-hidden" type="checkbox" name="answer" value={`answer-${id}`}
                    id={`answer-${id}`}
                    // userAnswers - ответы пользователя возвращает хук
                    checked={userAnswers[id]}
                    onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                      const {target} = evt;
                      const value = target.checked;
                      // возвращает хук для изменения состояния
                      handleAnswerChange(id, value);
                    }}
                  />
                  <label className="game__check" htmlFor={`answer-${id}`}>Отметить</label>
                </div>
              </div>
            );
          })}

          <button className="game__submit button" type="submit">Ответить</button>
        </form>
      </section>
    </section>
  );
}

export default GenreQuestionScreen;
