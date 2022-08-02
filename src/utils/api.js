 class Api {
  constructor (baseUrl, {headers}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

//метод, проверяющий какой результат пришел, возвращает объект если ок, и ошибку, если нет
  _checkRes(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

//метод, который реализует получение карточки с сервера
  getCards () {
    return fetch (`${this.baseUrl}/cards`, {
      headers: this.headers
    })
    .then (res => {return this._checkRes(res)})
  }

 // метод, который реализует получение данные пользователя с сервера
  getUserData () {
    return fetch (`${this.baseUrl}/users/me`, {
      headers: this.headers
    })
    .then (res => {return this._checkRes(res)})
  }

 // метод, который реализует редактирование данных пользователя на сервере
  postUserData (userName, about){
    return fetch (`${this.baseUrl}/users/me`, {
      headers: this.headers,
      method: 'PATCH',
      body: JSON.stringify({name: userName, about: about}),
    })
    .then (res => {return this._checkRes(res)})
  }

  //  метод, который реализует редактирование автара пользователя на сервере
  postUserPhoto (link){
    return fetch (`${this.baseUrl}/users/me/avatar`, {
      headers: this.headers,
      method: 'PATCH',
      body: JSON.stringify({avatar: link}),
    })
    .then (res => {return this._checkRes(res)})
  }

// метод, который реализует отправление карточки на сервер
  postCard (cardName, link){
    return fetch (`${this.baseUrl}/cards`, {
      headers: this.headers,
      method: 'POST',
      body: JSON.stringify({name: cardName, link: link}),
    })
    .then (res => {return this._checkRes(res)})
  }

// метод, который реализует установку лайка на карточку
  putLike (cardId){
    return fetch (`${this.baseUrl}/cards/${cardId}/likes`, {
      headers: this.headers,
      method: 'PUT',
    })
    .then (res => {return this._checkRes(res)})
  }

// метод, который реализует удаление лайка с карточки
  deleteLike (cardId){
    return fetch (`${this.baseUrl}/cards/${cardId}/likes`, {
      headers: this.headers,
      method: 'DELETE',
    })
    .then (res => {return this._checkRes(res)})
  }

// метод, который реализует удаление карточки с сервера  
  deleteCard (cardId) {
    return fetch (`${this.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this.headers
    })
    .then (res => {return this._checkRes(res)})
  }
}

/*создаем и экспортируем экземпляр класса api для использования в App*/ 
const api = new Api ('https://mesto.nomoreparties.co/v1/cohort-41', {
  headers: {
    authorization: '420a86b4-7133-4ca0-90cf-bb2cdda2a90c',
    'Content-Type': 'application/json'
  }
})

export default api;