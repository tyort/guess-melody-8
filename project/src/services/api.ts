import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';
import {getToken} from './token';

const BACKEND_URL = 'https://8.react.pages.academy/guess-melody'; // путь на сервер
const REQUEST_TIMEOUT = 5000; // по истечении этого времени прекращаем запрос

// Возвращаемые сервером коды
enum HttpCode {
  Unauthorized = 401, // не авторизован
}

// Эта функции потом будет взаимодействовать с хранилищем
type UnauthorizedCallback = () => void;

// AxiosInstance - тип сконфигурированного экземпляра axios
// onUnauthorized - взаимодействие с redux store, для диспатча определенного????? действия
export const createAPI = (onUnauthorized: UnauthorizedCallback): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL, // относительно адреса будут выполняться все запросы
    timeout: REQUEST_TIMEOUT,
  });

  // "Перехватчик" ответов от сервера
  api.interceptors.response.use(
    // Через эту прокладку(колбэк) ответ от сервера пойдет дальше, если ответ успешный(от 200 до 299)
    (response: AxiosResponse) => response,

    // колбэк для обработки ошибки
    (error: AxiosError) => {
      const {response} = error;

      if (response?.status === HttpCode.Unauthorized) {
        onUnauthorized();
      }

      // возвращаем отклоненный промис
      return Promise.reject(error);
    },
  );

  // запросы от клиента
  api.interceptors.request.use(
    // до отправки запроса сработает функция
    (config: AxiosRequestConfig) => {
      // Извлекаем из localsorage токен
      const token = getToken();

      if (token) {
        // если есть, то добавляем в заголовок 'x-token'
        config.headers['x-token'] = token;
      }

      // что такое config??????
      return config;
    },
  );

  return api;
};
