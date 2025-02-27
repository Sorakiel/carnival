import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/api'
import './Registration.css'

const HIGH_SCHOOLS = {
	ВШКМиС: 1,
	ВИШНМиТ: 2,
	ВШКИ: 3,
	ВШМ: 4,
	ВШП: 5,
	ВШСГН: 6,
	ВШФ: 7,
	ВШЭиБ: 8,
	ИПАМ: 9,
	Форсайт: 10,
	Интеграл: 11,
} as const

type HighSchoolName = keyof typeof HIGH_SCHOOLS

function Registration() {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		firstName: '',
		lastName: '',
		highSchool: '' as HighSchoolName | '',
	})
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const handleRegister = async () => {
		if (
			!formData.username ||
			!formData.password ||
			!formData.firstName ||
			!formData.lastName ||
			!formData.highSchool
		) {
			setError('Пожалуйста, заполните все поля')
			return
		}

		setIsLoading(true)
		setError('')

		try {
			await register({
				username: formData.username,
				password: formData.password,
				first_name: formData.firstName,
				last_name: formData.lastName,
				high_school: HIGH_SCHOOLS[formData.highSchool as HighSchoolName],
			})
			navigate('/profile')
		} catch (err) {
			setError('Ошибка регистрации. Попробуйте другой логин.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='auth-container'>
			<div className='auth-form'>
				<h2>Регистрация</h2>
				<input
					type='text'
					name='firstName'
					placeholder='Имя'
					value={formData.firstName}
					onChange={handleChange}
				/>
				<input
					type='text'
					name='lastName'
					placeholder='Фамилия'
					value={formData.lastName}
					onChange={handleChange}
				/>
				<input
					type='text'
					name='username'
					placeholder='Логин'
					value={formData.username}
					onChange={handleChange}
				/>
				<input
					type='password'
					name='password'
					placeholder='Пароль'
					value={formData.password}
					onChange={handleChange}
				/>
				<select
					name='highSchool'
					value={formData.highSchool}
					onChange={handleChange}
					className='high-school-select'
				>
					<option value=''>Выберите высшую школу</option>
					{Object.keys(HIGH_SCHOOLS).map(school => (
						<option key={school} value={school}>
							{school}
						</option>
					))}
				</select>
				{error && <p className='error-message'>{error}</p>}
				<button
					className='login-button'
					onClick={handleRegister}
					disabled={isLoading}
				>
					{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
				</button>
				<button className='auth-button' onClick={() => navigate('/')}>
					Назад
				</button>
			</div>
		</div>
	)
}

export default Registration
