import React from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import Header from './Header.js'
import Main from './Main.js'
import Footer from './Footer.js';

import ProtectedRoute from './ProtectedRoute.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import UpdateAvatarPopup from './UpdateAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js'
import InfoPopup from './InfoPopup.js';
import Login from './Login.js';
import Register from './Register.js';

import api from "../utils/api.js";
import * as mestoAuth from "../utils/mestoAuth.js"
import { CurrentUserContext } from '../context/CurrentUserContext.js'; 


const App = () => {
  /*установка контекста для пользователя*/
  const [currentUser, getCurrentUser] = React.useState({name: '', about: '', avatar: ''});

  React.useEffect(()=>{
    api.getUserData()
      .then((userData)=>{
        getCurrentUser(userData);
      })
      .catch((err) => console.error(err));
  }, []);

  /* хуки на открытие попапов */
  const [isEditProfilePopupOpen, openEditPopup] = React.useState(false);
  const [isAddPlacePopupOpen, openAddPopup] = React.useState(false);
  const [isUpdateAvatarPopupOpen, openUpdateAvatarPopup] = React.useState(false);
  const [isInfoPopupOpen, openInfoPopup] = React.useState(false);

  /*хуки и стейты для авторизации и регистрации пользователей */
  const [loggedIn, handleLogin]  = React.useState(false); //cтейт для отслеживания залогинился ли пользователь
  
  const [email, setEmail] = React.useState('test@test.ru');
  const [confirmMessage, setСonfirmMessage] = React.useState(false); //стейт для отображения результата на infoPopup
  const navigate = useNavigate();

  /*хук на определение выбранной карточки*/
  const [selectedCard, setSelectedCard] = React.useState({name: '', link: ''});

  /*хук карточек*/ 
  const [cards, setCards] = React.useState([]);
    



  /* обработчики  */
  const handleOpenEditPopup = ()=> {
    openEditPopup(true);
  }

  const handleOpenAddPopup = ()=> {
    openAddPopup(true);
  }

  const handleOpenUpdateAvatarPopup = ()=> {
    openUpdateAvatarPopup(true);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  /*функция на закрытие попапов*/
  const closeAllPopups = () => {
    openEditPopup(false);
    openAddPopup(false);
    openUpdateAvatarPopup(false);
    openInfoPopup(false);
    setSelectedCard({name: '', link: ''});
  }

  /*функция обновления данных пользователя через api*/
  const handleUpdateUser = ({name, about}) => {
    api.postUserData(name, about)
      .then((userData)=>{
        getCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  /*функция обновления аватара пользователя через api*/
  const handleUpdateAvatar = (avatar) => {
    api.postUserPhoto(avatar)
      .then((userData)=>{
        getCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  /*получаем карточки с api*/ 
  React.useEffect(()=>{
    api.getCards()
      .then((cardsData)=>{
        setCards(cardsData);
      })
      .catch((err) => console.error(err));
  }, [])

  const renewCards = (newCard, id) => {
    setCards((state) => state.map((c) => c._id === id ? newCard : c));
  }

/* обработчик нажатия кнопки лайк на карточке*/ 
  const handleCardLike = (card) => {
     const isLiked = card.likes.some(i => i._id === currentUser._id);

    /*в соответствии с вернувшимся результатом вызываем нужный метод api*/
    if (isLiked) {
      api.deleteLike(card._id, !isLiked)
        .then((newCard) => {
          renewCards(newCard, card._id)
        })
        .catch((err) => console.error(err));
    } else {
      api.putLike(card._id, isLiked)
        .then((newCard) => {
          renewCards(newCard, card._id)
        })
        .catch((err) => console.error(err));
      }
  }

/*обработчик нажатия кнопки удаления на карточке*/ 
  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
      .then (()=>{
        setCards((state) => state.filter((c)=>c._id !== card._id))
      })
      .catch((err) => console.error(err));
  }

/*обработчик добавления нового фото*/
  const handleAddPlaceSubmit = ({cardName, link}) => {
    api.postCard(cardName, link)
      .then((newCard)=>{
        setCards([newCard, ...cards])
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }
  
/*регистрация пользователя*/
  const onRegister = (password, email) => {
    mestoAuth.register(password, email)
      .then(() => {
        setСonfirmMessage(true); //показываем уведомление об успешной регистрации
        navigate('/sign-in');
      })
      .catch(err => {
        setСonfirmMessage(false); //показываем уведомление об ошибке при регистрации
        console.log(err);
      })
      .finally(() => {
        openInfoPopup(true);
      });
  }

/*отправляем запрос на авторизацию через api и при положительном ответе, 
  логиним юзера, сохраняем токен для дальнейшей работы*/
  const onLogin = (password, email) => {
    mestoAuth.authorize (password, email)
      .then(res => {
        localStorage.setItem('token', res.token);
        setEmail(email);
        handleLogin(true);
        navigate('/');
      })
      .catch(err => {
        console.log(err);
      })
  }

/*проверяем корректен ли токен, который хранится в local storage*/
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      mestoAuth.checkToken(token)
        .then(res => { 
          setEmail(res.data.email);
          handleLogin(true);
          navigate('/');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [navigate])
 
/*удаляем из local storage токен и разлогиниваемся*/
  const onSignOut = () => {
    localStorage.removeItem('token');
    handleLogin(false);
  };


/* Спасибо за подсказки, сделаю все обязательно <3 */


/* возвращаемый объект */
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">
           
          <Routes>
            <Route  path="/"
                    element = {<ProtectedRoute loggedIn={loggedIn}>
                                 <Header onSignOut   = {onSignOut} 
                                         email       = {email} 
                                         linkTo      = {'/'} 
                                         linkText    = {'Выйти'} />
                                        
                                 <Main onEditProfile     = {handleOpenEditPopup}
                                       onAddPlace        = {handleOpenAddPopup} 
                                       onEditAvatar      = {handleOpenUpdateAvatarPopup}
                                       onCardClick       = {handleCardClick}
                                       cards             = {cards}
                                       onCardLikeClick   = {handleCardLike}
                                       onCardDeleteClick = {handleCardDelete}/>
                              </ProtectedRoute>}>
            </Route>

            <Route path="/sign-up"
                   element = {<Register onRegister={onRegister}/> }>
            </Route> 

            <Route path="/sign-in"
                   element = {<Login onLogin={onLogin}/> }>
            </Route>

            <Route path="*"
                   element = {loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" /> }>
            </Route>        
          </Routes>
        
          <Footer />
 
          {/* попапы */}
          <EditProfilePopup isOpen       = {isEditProfilePopupOpen} 
                            onClose      = {closeAllPopups} 
                            onUpdateUser = {handleUpdateUser} /> 


          <UpdateAvatarPopup isOpen         = {isUpdateAvatarPopupOpen} 
                             onClose        = {closeAllPopups} 
                             onUpdateAvatar = {handleUpdateAvatar} />


          <AddPlacePopup isOpen     = {isAddPlacePopupOpen} 
                         onClose    = {closeAllPopups} 
                         onAddPlace = {handleAddPlaceSubmit}/>


          <ImagePopup card    = {selectedCard}
                      onClose = {closeAllPopups}/>

          <InfoPopup  isOpen    = {isInfoPopupOpen}
                      onClose   = {closeAllPopups}
                      confirmMessage = {confirmMessage}/>
        
        </div>
      </div>
      </CurrentUserContext.Provider>
  );
}

export default App;
