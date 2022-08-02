// работа с api для регистрации и авторизации пользователя

export const BASE_URL = 'https://auth.nomoreparties.co';

/*для проверки ответа от api*/
const checkRes = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Что-то не так! Ошибка: ${res.status}`);
}

/*функция для отправки запроса на регистрацию*/
export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
                        password: password, 
                        email: email 
                        })
    })
    .then(checkRes);
};

/*функция для отправки запроса на авторизацию*/
export const authorize = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
                        password: password, 
                        email: email 
                        })
    })
    .then(checkRes);
};

/*функция для отправки запроса на проверку токена*/
export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
    }).then(checkRes);
  };