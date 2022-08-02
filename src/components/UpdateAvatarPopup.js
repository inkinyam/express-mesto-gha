import React from "react";
import PopupWithForm from "./PopupWithForm.js";


const UpdateAvatarPopup = ({isOpen, onClose, onUpdateAvatar}) => {
  /* создаем ref для аватара*/
  const avatar = React.useRef();

  /*обновляем поля при открытии*/
  React.useEffect(() => {avatar.current.value = ''}, [isOpen]);

  /* обработчик сабмита формы*/
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateAvatar(avatar.current.value);
  }

  /* возвращаемый объект*/
  return (
    <PopupWithForm  name = 'update-avatar' 
      title    = 'Обновить аватар'
      btnText  = 'Сохранить'
      isOpen   = {isOpen}
      onClose  = {onClose}
      onSubmit = {handleSubmit}>
    
      <input ref = {avatar} 
             type = "url" 
             className = "popup__item popup__item_el_avatar" 
             id = "update-avatar-form__avatar"  
             name = "inputAvatarLink" 
             placeholder = "Ссылка на новую картинку" 
             required />

      <span className="popup__span-error update-avatar-form__avatar-error"></span>
    </PopupWithForm>
  )
}


export default UpdateAvatarPopup;


