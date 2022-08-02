
const ImagePopup= ({card, onClose}) => {
  /* возвращаемый объект */
  return (
    <div className={`popup popup-photo`+`${card.name ? ' popup_opened' : ''}`}>
      <div className="popup__figure">
      <button className="popup__button popup__button_type_exit popup-photo__exit" type="button" onClick = {onClose}></button>
      <img className="popup__image" src={card.link} alt={card.name} />
      <p className="popup__caption">{card.name}</p>
    </div>
  </div>
  );
}

export default ImagePopup;