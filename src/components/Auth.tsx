import { useNavigate } from 'react-router-dom'
import './Auth.css'

function Auth() {
	const navigate = useNavigate()

	return (
		<div className='auth-container'>
			<div className='auth-form'>
				<h2>Авторизация</h2>
				<input type='text' placeholder='Логин' />
				<input type='password' placeholder='Пароль' />
				<button className='login-button'>Войти</button>
				<button
					className='auth-button'
					onClick={() => navigate('/registration')}
				>
					Регистрация
				</button>
				<button className='admin-button' onClick={() => navigate('/profile')}>
					Админ
				</button>
			</div>
		</div>
	)
}

export default Auth
