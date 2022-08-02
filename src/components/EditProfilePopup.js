import React from "react";
import PopupWithForm from "./PopupWithForm.js";
import { CurrentUserContext } from '../context/CurrentUserContext.js'; 

const EditProfilePopup = ({isOpen, onClose, onUpdateUser}) => {
  /* подписка на контент*/
  const currentUser = React.useContext(CurrentUserContext);

  /* стейт и обработка изменений на инпуте title*/
  const [nameValue, setName] = React.useState('');

  function handleChangeName(e) {
    setName(e.target.value);
  }

    /* стейт и обработка изменений на инпуте subtitle*/
  const [descriptionValue, setDescription] = React.useState('');

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

    /*обновляем значения инпутов при открытии*/
    React.useEffect(() => {
      setName(currentUser.name);
      setDescription(currentUser.about);
      }, [currentUser, isOpen]);

  /* После загрузки текущего пользователя из API его данные будут использованы в управляемых компонентах.*/
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
    }, [currentUser, isOpen]); 

  /*обработчик сабмита формы*/
  const handleSubmit = (e) => {
    e.preventDefault();

    onUpdateUser({
      name: nameValue,
      about: descriptionValue,
    });

  }

  /*возвращаемый объект*/
  return (
    <PopupWithForm  name     = 'edit' 
                    title    = 'Редактировать профиль'
                    btnText  = 'Сохранить'
                    isOpen   = {isOpen}
                    onClose  = {onClose}
                    onSubmit = {handleSubmit}>
                                              
            <input value={nameValue} 
                   onChange={handleChangeName} 
                   type="text" 
                   className="popup__item popup__item_el_title" 
                   id="edit-form__title" 
                   name="popup_title" 
                   placeholder="Введите имя" 
                   minLength="2" 
                   maxLength="40" 
                   required />
            <span className="popup__span-error edit-form__title-error"></span>

            <input value={descriptionValue} 
                   onChange={handleChangeDescription} 
                   type="text" 
                   className="popup__item popup__item_el_subtitle" 
                   id="edit-form__subtitle" 
                   name="popup_sutitle" 
                   placeholder="Введите должность" 
                   minLength="2" 
                   maxLength="200" 
                   required />
            <span className="popup__span-error edit-form__subtitle-error"></span>
    </PopupWithForm>
  )
} 


export default EditProfilePopup;