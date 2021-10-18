import {ComponentType} from 'react';
import {useState} from 'react';
import AudioPlayer from '../../components/audio-player/audio-player';

type HOCProps = {
  renderPlayer: (src: string, id: number) => void
};

// ComponentType - это тайпинг самого Реакт, по умолчанию для пропсов предусмотрен пустой объект. Тип для Component.
// в T мы передаем тайпинги/типы пропсов, которые принимает наш компонент
function withAudioPlayer<T>(Component: ComponentType<T>): ComponentType<Omit<T, keyof HOCProps>> {
  // От родителя Component мы не должны ждать пропс renderPlayer
  // т.е. в "...имя...Wrapped" в пропсы не вкладываем renderPlayer
  type ComponentProps = Omit<T, keyof HOCProps>;

  function WithAudioPlayer(props: ComponentProps): JSX.Element {
    const [activePlayerId, setActivePlayerId] = useState(0);
    return (
      <Component
        // props от родителя Component, подтверждаем тип T
        {...props as T}
        // объявим функцию, которую вызовем внутри каждого компонента
        renderPlayer={(src: string, id: number) => (
          <AudioPlayer
            src={src}
            isPlaying={id === activePlayerId}
            // в компоненте плеера происходит вызов колбэка по нажатию button
            onPlayButtonClick={() => {
              setActivePlayerId(activePlayerId === id ? -1 : id);
            }}
          />
        )}
      />
    );
  }

  return WithAudioPlayer;
}

export default withAudioPlayer;
