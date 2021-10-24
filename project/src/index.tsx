import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {Provider} from 'react-redux'; // мостик между React и Redux
import App from './components/app/app';
import {reducer} from './store/reducer';

// Глобальное хранилище приложения
const store = createStore(
  reducer,
  composeWithDevTools(),
);
ReactDOM.render(
  <React.StrictMode>
    {/* Для возможности использовать store в компонентах,
    вследствие этого мы можем использовать метод connect*/}
    <Provider store = {store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'));
