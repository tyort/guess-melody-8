import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createAPI} from './services/api';
import {composeWithDevTools} from 'redux-devtools-extension';
import {Provider} from 'react-redux'; // мостик между React и Redux
import App from './components/app/app';
import {reducer} from './store/reducer';
import {requireAuthorization} from './store/action';
import {fetchQuestionAction, checkAuthAction} from './store/api-actions';
import {ThunkAppDispatch} from './types/action';
import {AuthorizationStatus} from './const';

// api - вернет сконфигурированный экземпляр axios
// потом этот аргумент мы сможем передавать в качестве аргумента в api-actions
const api = createAPI(
  // в reducer запускаем действие, чтобы в state запихнуть AuthorizationStatus.NoAuth
  () => store.dispatch(requireAuthorization(AuthorizationStatus.NoAuth)),
);

// Глобальное хранилище приложения
const store = createStore(
  reducer,
  // поддержка DevTools
  composeWithDevTools(
    // для регистрации middleware
    // withExtraArgument - для передачи асинхронной переменной
    applyMiddleware(thunk.withExtraArgument(api)),
  ),
);

// Диспатчим асинхронные действия checkAuthAction и fetchQuestionAction
(store.dispatch as ThunkAppDispatch)(checkAuthAction());
(store.dispatch as ThunkAppDispatch)(fetchQuestionAction());

ReactDOM.render(
  <React.StrictMode>
    {/* Для возможности использовать store в компонентах,
    вследствие этого мы можем использовать метод connect*/}
    <Provider store = {store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'));
