import {Fragment, useState, useEffect, useRef} from 'react';

type AudioPlayerProps = {
  isPlaying: boolean;
  src: string;
  onPlayButtonClick: () => void;
}

function AudioPlayer({isPlaying, src, onPlayButtonClick}: AudioPlayerProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current !== null) {
      // Когда мелодия готова для воспроизведения - значит isLoading===false
      audioRef.current.onloadeddata = () => setIsLoading(false);
    }

    // Функция в return будет выполнена при удалении компонента,
    // аналогично componentWillUnmount в классовом компоненте.
    return () => {
      if (audioRef.current !== null) {
        audioRef.current.onloadeddata = null; // мелодия не готова для воспроизведения
        audioRef.current = null; // элемента не существует
      }
    };
  // Массив ниже. Если он пустой, то это означает, что useEffect выполнится единожды после монтирования компонента componentDidMount.
  // При изменении src запустится useEffect. Похоже на componentDidUpdate.
  }, [src]);

  useEffect(() => {
    if (audioRef.current === null) {
      return;
    }

    // Воспроизведение мелодии
    if (isPlaying) {
      audioRef.current.play();
      return;
    }

    audioRef.current.pause();
  }, [isPlaying]);

  return (
    <Fragment>
      <button
        className={`track__button track__button--${isPlaying ? 'pause' : 'play'}`}
        type="button"
        disabled={isLoading}
        onClick={onPlayButtonClick}
      />
      <div className="track__status">
        {/* ref - поможет получить доступ из React к DOM-дереву, т.е. мы не можем использовать querySelector */}
        <audio src={src} ref={audioRef} />
      </div>
    </Fragment>
  );
}

export default AudioPlayer;
