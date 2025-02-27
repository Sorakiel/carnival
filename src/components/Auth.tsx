import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/api'
import './Auth.css'

function Auth() {
	const navigate = useNavigate()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleLogin = async () => {
		if (!username || !password) {
			setError('Пожалуйста, заполните все поля')
			return
		}

		setIsLoading(true)
		setError('')

		try {
			await login({ username, password })
			navigate('/profile')
		} catch (err) {
			setError('Ошибка авторизации. Проверьте логин и пароль.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='auth-container'>
			<div className='auth-form'>
				<h2>Авторизация</h2>
				<input
					type='text'
					placeholder='Логин'
					value={username}
					onChange={e => setUsername(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Пароль'
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				{error && <p className='error-message'>{error}</p>}
				<button
					className='login-button'
					onClick={handleLogin}
					disabled={isLoading}
				>
					{isLoading ? 'Вход...' : 'Войти'}
				</button>
				<button
					className='auth-button'
					onClick={() => navigate('/registration')}
				>
					Регистрация
				</button>
			</div>
		</div>
	)
}

export default Auth
