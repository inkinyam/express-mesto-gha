import React from "react";
import PopupWithForm from "./PopupWithForm.js";

const AddPlacePopup = ({isOpen, onClose, onAddPlace}) => {

  /*сделали инпуты управляемыми*/
  const [cardName, setCardName] = React.useState('');
  const [cardLink, setCardLink] = React.useState('');

  function handleChangeCardName(evt) {
    setCardName(evt.target.value);
  }

  function handleChangeCardLink(evt) {
    setCardLink(evt.target.value);
  }

  /*обновляем значения инпутов при открытии*/
  React.useEffect(() => {
    setCardName('');
    setCardLink('');
    }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPlace({
          cardName: cardName,
          link: cardLink
        });
  }

  return (
    <PopupWithForm  name = 'add' 
      title   = 'Новое место'
      btnText = 'Сохранить'
      isOpen  = {isOpen}
      onClose = {onClose}
      onSubmit = {handleSubmit}>
      
      <input value = {cardName} 
             onChange = {handleChangeCardName}
             type = "text" 
             className = "popup__item popup__item_el_name" 
             id = "add-form__name" 
             name = "popup_title" 
             placeholder = "Название места" 
             minLength = "2" 
             maxLength = "30" 
             required />

      <span className="popup__span-error add-form__name-error"></span>

      <input value = {cardLink} 
             onChange = {handleChangeCardLink}
             type = "url" 
             className = "popup__item popup__item_el_link" 
             id = "add-form__link"  
             name = "popup_sutitle" 
             placeholder = "Ссылка на картинку" 
             required />

      <span className="popup__span-error add-form__link-error"></span>
    </PopupWithForm>
  )
}

export default AddPlacePopup;