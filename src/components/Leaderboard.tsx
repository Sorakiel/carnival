import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeaderboard } from '../api/api'
import { LeaderboardEntry } from '../api/types'
import './Leaderboard.css'

function Leaderboard() {
	const navigate = useNavigate()
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				const data = await getLeaderboard()
				// Проверяем, что data является массивом
				if (!Array.isArray(data)) {
					console.error('Данные лидерборда не являются массивом:', data)
					setError('Неверный формат данных лидерборда')
					return
				}
				setLeaderboard(data)
			} catch (err) {
				console.error('Ошибка при загрузке лидерборда:', err)
				setError('Не удалось загрузить данные лидерборда')
			} finally {
				setIsLoading(false)
			}
		}

		fetchLeaderboard()
	}, [])

	return (
		<div className='leaderboard-container'>
			<div className='back-button-container'>
				<button className='back-button' onClick={() => navigate('/profile')}>
					Назад
				</button>
			</div>
			<div className='leaderboard-content'>
				<h2>Лидерборд</h2>
				{isLoading ? (
					<p>Загрузка...</p>
				) : error ? (
					<p className='error-message'>{error}</p>
				) : leaderboard.length === 0 ? (
					<p>Данные лидерборда пока недоступны</p>
				) : (
					<div className='leaderboard-list'>
						{leaderboard.map((entry, index) => (
							<div key={index} className='leaderboard-item'>
								<span className='position'>#{entry.position}</span>
								<span className='username'>{entry.full_name}</span>
								<span className='score'>{entry.score}</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default Leaderboard
