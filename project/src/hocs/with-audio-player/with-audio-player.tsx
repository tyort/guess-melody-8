import {ComponentType} from 'react';
import {useState} from 'react';
import AudioPlayer from '../../components/audio-player/audio-player';

type HOCProps = {
  renderPlayer: (src: string, id: number) => void
};

// T - это псевдоним типа, сложившийся из пропсов компонента, который мы оборачиваем в HOC
function withAudioPlayer<T>(Component: ComponentType<T>): ComponentType<Omit<T, keyof HOCProps>> {

  // Новый псевдоним типа для пропсов обернутого компонент. БЕЗ пропсов из HOCProps.
  type ComponentProps = Omit<T, keyof HOCProps>;

  function WithAudioPlayer(props: ComponentProps): JSX.Element {
    const [activePlayerId, setActivePlayerId] = useState(0);
    return (
      <Component
        // props от родителя Component
        {...props as T}
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
