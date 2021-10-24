const AUTH_TOKEN_KEY_NAME = 'guess-melody-token';

export type Token = string;

// считываем токен из хранилища
export const getToken = (): Token => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY_NAME);
  // ?? отличается от || тем, что для него ложные значения только null и undefined
  return token ?? '';
};

export const saveToken = (token: Token): void => {
  localStorage.setItem(AUTH_TOKEN_KEY_NAME, token);
};

export const dropToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY_NAME);
};
