import React from 'react';
import Card from './Card.js';
import { CurrentUserContext } from '../context/CurrentUserContext.js'; 


const Main = ({onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLikeClick, onCardDeleteClick}) => {

  /* подписываемся на контекст */
  const currentUser = React.useContext(CurrentUserContext);

  /* возвращаемый объект */ 
  return (
    <main className="content content_visible">
      <section className="profile">
        <img className="profile__avatar" src={currentUser.avatar} alt="аватар" />
        <button type="button" className="profile__edit-avatar" onClick={onEditAvatar}></button>
        <div className="profile__name">
          <h1 className="profile__title">{currentUser.name}</h1>
          <button type="button" className="profile__edit-button" onClick={onEditProfile}></button>
        </div>
        <p className="profile__subtitle">{currentUser.about}</p>
        <button type="button" className="profile__add-button" onClick={onAddPlace}> </button>
      </section>

      <section className="places" aria-label="Фотографии">

        {cards.map(card => (
             <Card key = {card._id} 
                   card = {card} 
                   onCardClick = {onCardClick} 
                   onLikeClick = {onCardLikeClick} 
                   onDeleteClick = {onCardDeleteClick} />
        ))}

       </section>
    </main>
  )
}
export default Main;


