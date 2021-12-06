import axios, {AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig} from 'axios';
import { getToken } from './token';

const BACKEND_URL = 'https://8.react.pages.academy/guess-melody';
const REQUEST_TIMEOUT = 5000; // Время после которого мы считаем что запрос failed;

// Коды ответов от сервера
enum HttpCode {
  Unauthorized = 401, // Пользователь не авторизован
}

// Можно проследить: колбэк данного типа выполняется в случае ответа от сервера HttpCode.Unauthorized
type UnauthorizedCallback = () => void;

// Результат вызова createAPI - скофигурированный экземпляр axios(тип AxiosInstance);
export const createAPI = (onUnauthorized: UnauthorizedCallback): AxiosInstance => {

  // При создании экземпляра axios передаем объект с настройками;
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  // Настраиваем перехватчик(что-то похожее на middleware) запросов от клиента;
  api.interceptors.request.use(

    // Функцию мы выполним до отправки запроса на сервер;
    (config: AxiosRequestConfig) => {

      // Извлекаем из localstorage token;
      const token = getToken();

      if (token) {

        // Добавляем токен в указанный заголовок;
        config.headers['x-token'] = token;
      }

      return config; // возвращаем config типа AxiosRequestConfig;
    },
  );

  // Настраиваем перехватчик(что-то похожее на middleware) ответов от сервера;
  // Метод use содержит два колбэка
  api.interceptors.response.use(

    // 1-ый колбэк выполнится в случае ответа от сервера: от 200 до 299;
    // В качестве параметра придет ответ от сервера(тип AxiosResponse). Его и возвращаем;
    (response: AxiosResponse) => response,

    // 2-й колбэк выполнится в случае других ответов от сервера;
    (error: AxiosError) => {
      const {response} = error;

      if (response?.status === HttpCode.Unauthorized) {
        return onUnauthorized();
      }

      // Возвращаем объект Promise, который отклонен по причине "error"
      return Promise.reject(error);
    },
  );

  return api;
};
