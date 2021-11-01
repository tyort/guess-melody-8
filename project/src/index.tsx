import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createAPI} from './services/api';
import {composeWithDevTools} from 'redux-devtools-extension';
import {Provider} from 'react-redux'; // мостик между React и Redux
import App from './components/app/app';
import {rootReducer} from './store/root-reducer';
import {requireAuthorization} from './store/action';
import {fetchQuestionAction, checkAuthAction} from './store/api-actions';
import {ThunkAppDispatch} from './types/action';
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

// Глобальное хранилище приложения
const store = createStore(
  // Подключение редьюсера при создании хранилища
  rootReducer,
  composeWithDevTools( // Поддержка DevTools. Здесь регистрируем middleware
    // Посредник в Redux. В момент между:
    //  1) Мы бросили экшен,
    //  2) Экшн обработал редьюсер.
    // -- можно совершить действие

    // withExtraArgument - для передачи асинхронной переменной
    applyMiddleware(thunk.withExtraArgument(api)),

    // Для реализации перенаправления через api-action
    // все экшн store проходят через redirect
    applyMiddleware(redirect),
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
      <ToastContainer />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'));
