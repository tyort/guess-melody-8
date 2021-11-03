import React from 'react';
import ReactDOM from 'react-dom';

// Можно убрать импорты redux, redux-devtools-extension и redux-thunk. Они и так в этом пакете есть
import {configureStore} from '@reduxjs/toolkit';

import {createAPI} from './services/api';
import {Provider} from 'react-redux';
import App from './components/app/app';
import {rootReducer} from './store/root-reducer';
import {requireAuthorization} from './store/action';
import {fetchQuestionAction, checkAuthAction} from './store/api-actions';
import {AuthorizationStatus} from './const';
import {redirect} from './store/middlewares/redirect';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// api - вернет сконфигурированный экземпляр axios
// потом этот аргумент мы сможем передавать в качестве аргумента в api-actions
const api = createAPI(
  // в reducer запускаем действие, чтобы в state запихнуть AuthorizationStatus.NoAuth
  () => store.dispatch(requireAuthorization(AuthorizationStatus.NoAuth)),
);

// configureStore - конфигурируем хранилище, в качестве аргумента: объект с настройками, включена подддержка Redux DevTools
const store = configureStore({
  reducer: rootReducer, // корневой редьюсер

  // devTools: false, // отключить Redux DevTools

  middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware - возвращает массив с middleware
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }).concat(redirect),
});

// Диспатчим асинхронные действия checkAuthAction и fetchQuestionAction
store.dispatch(checkAuthAction());
store.dispatch(fetchQuestionAction());

ReactDOM.render(
  <React.StrictMode>
    {/* Для возможности использовать store в компонентах,
    вследствие этого мы можем использовать метод connect*/}
    <Provider store = {store}>
      <ToastContainer />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'));
