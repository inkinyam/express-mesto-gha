
const PopupWithForm = ({name, onClose, title, children, btnText, isOpen, onSubmit}) => {
  /* возвращаемый объект */
  return (
    <div className={`popup popup-${name}`+ (isOpen && ' popup_opened')}>
        <form className="popup__wrapper edit-form" name={`${name}Form`} action="#" onSubmit={onSubmit} >
          <button className="popup__button popup__button_type_exit" type="button" onClick = {onClose}></button>
          <h2 className="popup__title">{title}</h2>
          {children}
          <button type="submit" className="popup__button popup__button_type_save" >{btnText}</button>
        </form>
      </div>
  );
}

export default PopupWithForm;