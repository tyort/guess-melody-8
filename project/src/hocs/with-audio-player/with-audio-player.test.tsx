import {render, screen} from '@testing-library/react';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import withAudioPlayer from './with-audio-player';
import ArtistQuestionScreen from '../../components/artist-question-screen/artist-question-screen';
import {makeFakeArtistQuestion} from '../../utils/mocks';

// Замокаем компонент импортируемый в Хок(не тот, который оборачиваем в Хок)
jest.mock('../../components/audio-player/audio-player', () => {
  const mockAudioPlayer = () => <>This is mock AudioPlayer</>;
  return {
    __esModule: true,
    default: mockAudioPlayer,
  };
});

describe('HOC: withAudioPlayer', () => {
  it('base component should correct rendering when use with HOC', () => {
    // "() => <h1>withAudioPlayer</h1>" - тип ComponentType<T> (функциональный компонент)
    const BaseComponentWrapped = withAudioPlayer(() => <h1>withAudioPlayer</h1>);
    render(<BaseComponentWrapped />);
    expect(screen.getByText(/withAudioPlayer/i)).toBeInTheDocument();
  });

  it('base component should correct rendering another component with render-prop', () => {
    const mockQuestion = makeFakeArtistQuestion();
    const history = createMemoryHistory();
    const BaseComponentWrapped = withAudioPlayer(ArtistQuestionScreen);
    render(
      <Router history={history}>
        <BaseComponentWrapped
          // Пропсы от родителя
          onAnswer={jest.fn()}
          question={mockQuestion}
        >
          {/* вместо детей */}
          <p>This is children component</p>
        </BaseComponentWrapped>
      </Router>,
    );

    expect(screen.getByText(/This is children component/i)).toBeInTheDocument();
    expect(screen.getByText(/This is mock AudioPlayer/i)).toBeInTheDocument();
    expect(screen.getByText(/Кто исполняет эту песню/i)).toBeInTheDocument();
  });
});
