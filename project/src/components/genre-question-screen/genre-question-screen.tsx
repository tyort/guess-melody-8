import {useState, ChangeEvent} from 'react';
import Logo from '../logo/logo';
import {QuestionGenre} from '../../types/question';

type GenreQuestionScreenProps = {
  question: QuestionGenre;
};

function GenreQuestionScreen(props: GenreQuestionScreenProps): JSX.Element {
  const {question} = props;
  const {answers, genre} = question;

  // useState(начальное значение СОСТОЯНИЯ) - это хук, это функция;
  // userAnswers - начальное значение СОСТОЯНИЯ, которое мы задали;
  // setUserAnswers - аналог this.setState, ф-ия для обновления значения.
  //                  При его вызове обновляется функциональный компонент и его дети;
  const [userAnswers, setUserAnswers] = useState([false, false, false, false]);

  return (
    <section className="game game--genre">
      <header className="game__header">
        <Logo />

        <svg xmlns="http://www.w3.org/2000/svg" className="timer" viewBox="0 0 780 780">
          <circle className="timer__line" cx="390" cy="390" r="370"
            style={{filter: 'url(#blur)', transform: 'rotate(-90deg) scaleY(-1)', transformOrigin: 'center'}}
          />
        </svg>

        <div className="game__mistakes">
          <div className="wrong"/>
          <div className="wrong"/>
          <div className="wrong"/>
        </div>
      </header>

      <section className="game__screen">
        <h2 className="game__title">Выберите {genre} треки</h2>
        <form className="game__tracks">
          {answers.map((answer, id) => {
            const keyValue = `${id}-${answer.src}`;
            return (
              <div key={keyValue} className="track">
                <button className="track__button track__button--play" type="button"/>
                <div className="track__status">
                  <audio
                    src={answer.src}
                  />
                </div>
                <div className="game__answer">
                  <input className="game__input visually-hidden" type="checkbox" name="answer" value={`answer-${id}`}
                    id={`answer-${id}`}
                    checked={userAnswers[id]}
                    // тайпинг ChangeEvent<HTMLInputElement> (см. импорт)
                    // события в реакте синтетические
                    onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                      const {target} = evt;
                      const value = target.checked;
                      setUserAnswers([...userAnswers.slice(0, id), value, ...userAnswers.slice(id + 1)]);
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
