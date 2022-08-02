import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header.js';

const Register = ({ onRegister }) => {
 const [userEmail, setUserEmail] = React.useState('');
 const [userPass, setUserPass]   = React.useState('');
 
  const handleChangeEmail = (evt) => {
    setUserEmail(evt.target.value);
  }

  const handleChangePass = (evt) => {
    setUserPass(evt.target.value);
  }

  const handleSubmit = (evt) =>{
    evt.preventDefault();
    onRegister (userPass, userEmail);
  } 


  return (
    <>
      <Header linkText={'Войти'} linkTo={'/sign-in'} />
      <div className='login'>
        <form className="login__form" onSubmit={handleSubmit}>
          <h2 className='login__title'>Регистрация</h2>
          <input type = "email" 
                 className = "login__input" 
                 name = "email" 
                 placeholder = "Email" 
                 onChange = {handleChangeEmail} 
                 value = {userEmail} 
                 required />

          <input  type = "password" 
                  className = "login__input" 
                  name = "password" 
                  placeholder = "Пароль" 
                  onChange = {handleChangePass} 
                  value = {userPass}
                  required />
          <button type="submit" className='login__submit'> Зарегистрироваться </button>
        </form>
        <div className="login__signup">
            <p className="login__advice">Уже зарегистрированы?</p>
            <Link to="/sign-in" className="login__link">Войти</Link>
        </div>
      </div>
    </>
  )
}

export default Register;