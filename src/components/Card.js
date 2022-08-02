import { CurrentUserContext } from '../context/CurrentUserContext.js'; 
import React from 'react';

const Card= ({card, onCardClick, onLikeClick, onDeleteClick}) => {
/*пробрасываемая из App функция установки state для открытия увеличенной фото*/
  const currentUser = React.useContext(CurrentUserContext);  

  const handleCardClick = () => {
    onCardClick(card); 
  };

  const handleLikeClick = () => {
    onLikeClick(card); 
  };

  const handleDeleteClick = () => {
    onDeleteClick(card); 
  };

  /*определяем, являемся ли мы владельцем текущей карточки*/
  const isOwn = card.owner._id === currentUser._id;

  /*создаём переменную, которую после зададим в `className` для кнопки удаления*/
  const cardDeleteButtonClassName = (
    `place__button-delete ${isOwn ? 'place__button-delete_visible' : 'place__button-delete_hidden'}`
  ); 

  /*определяем, есть ли у карточки лайк, поставленный текущим пользователем*/
  const isLiked = card.likes.some(i => i._id === currentUser._id);

  /*создаём переменную, которую после зададим в `className` для кнопки лайка*/
  const cardLikeButtonClassName = (
    `place__button-like ${isLiked ? 'place__button-like_active' : 'place__button-like_unactive'}`
  ); 
  /* возвращаемый объект */
  return (
    <div className="place">
      <button className={cardDeleteButtonClassName} onClick={handleDeleteClick} type="button"></button>
      <img className="place__image" src={card.link} alt="" onClick={handleCardClick}/>
      <div className="place__description">
        <p className="place__text">{card.name}</p>
        <div className="place__like-container">
          <button className={cardLikeButtonClassName} onClick={handleLikeClick} type="button"></button>
          <p className="place__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </div>

  )
}
export default Card;