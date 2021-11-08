import {render} from '@testing-library/react';
import LoadingScreen from './loading-screen';

describe('Component: LoadingScreen', () => {
  test('should render correctly', () => {
    // Рендерится компонент, возвращается объект. container - куда отрендерился компонент
    // render - не рендерится именно в браузере, а просто выдает нам разметку
    const {container} = render(<LoadingScreen />);
    expect(container).toMatchSnapshot();
  });
});
