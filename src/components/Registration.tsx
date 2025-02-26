import { useNavigate } from 'react-router-dom'
import './Registration.css'

function Registration() {
	const navigate = useNavigate()

	return (
		<div className='auth-container'>
			<div className='auth-form'>
				<h2>Регистрация</h2>
				<input type='text' placeholder='Имя фамилия' />
				<input type='text' placeholder='Логин' />
				<input type='password' placeholder='Пароль' />
				<input type='text' placeholder='Высшая школа' />
				<button className='login-button'>Зарегистрироваться</button>
				<button className='auth-button' onClick={() => navigate('/')}>
					Назад
				</button>
			</div>
		</div>
	)
}

export default Registration
