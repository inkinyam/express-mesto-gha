/*импортируем логотип*/
import { Link } from 'react-router-dom';
import logo from '../../src/images/logo.svg'

const Header = ({email, linkTo, onSignOut, linkText}) => {
  /* возвращаемый объект */
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип" />
      <div className="header__container">
        {email ? <p className='header__username'> {email} </p> : ''}
        <Link className='header__button' to={linkTo} onClick={onSignOut}> {linkText} </Link> 
      </div>
    </header>
  )
}

export default Header;