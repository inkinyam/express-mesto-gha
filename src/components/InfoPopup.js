/*попап с уведомлением о регистрации */

const InfoPopup = ({isOpen, onClose, confirmMessage}) => {
  const handlePopupText  = confirmMessage ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз';
  const handlePopupImage = confirmMessage ? 'popup__info-img_type_succes' : 'popup__info-img_type_fail';

  return (
    <div className={`popup popup-info`+ (isOpen && ' popup_opened')}>
    <form className="popup__wrapper info-form" name={`infoForm`}>
      <button className="popup__button popup__button_type_exit" type="button" onClick = {onClose}></button>
      <div className={`popup__info-img  ${handlePopupImage}`} ></div>
      <p className="popup__info-text">{handlePopupText}</p>
    </form>
  </div>
  )
}

export default InfoPopup;
