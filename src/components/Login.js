import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header.js';

const Login = ({onLogin}) => {
  const [userEmail, setUserEmail] = React.useState('');
  const [userPass, setUserPass]   = React.useState('');
 
  const handleChangeEmail = (evt) => {
    setUserEmail(evt.target.value);
  }

  const handleChangePass = (evt) => {
    setUserPass(evt.target.value);
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onLogin(userPass, userEmail)
  }
    
  return (
    <>
      <Header linkText={'Зарегистрироваться'} linkTo={'/sign-up'}  />
      <div className='login'>
        <form className="login__form" onSubmit={handleSubmit}>
          <h2 className='login__title'>Вход</h2>
          <input type = "email" 
                 className = "login__input" 
                 id = "logIn-form__name" 
                 name = "login" 
                 placeholder = "Email" 
                 onChange = {handleChangeEmail} 
                 value = {userEmail} 
                 required />

          <input  type = "password" 
                  className = "login__input" 
                  id = "logIn-form__pass"  
                  name = "passwrd"
                  placeholder = "Пароль" 
                  onChange = {handleChangePass} 
                  value = {userPass}
                  required />
          <button type="submit" className='login__submit'>Войти</button>
        </form>
        <div className="login__signup">
            <p className="login__advice">Ещё не зарегистрированы?</p>
            <Link to="/sign-up" className="login__link">Зарегистрироваться</Link>
        </div>
      </div>
    </>
  )
}

export default  Login;