import { useNavigate } from 'react-router-dom'
import './Leaderboard.css'

function Leaderboard() {
	const navigate = useNavigate()

	return (
		<div className='leaderboard-container'>
			<div className='back-button-container'>
				<button className='back-button' onClick={() => navigate('/profile')}>
					Назад
				</button>
			</div>
			<div className='leaderboard-content'>
				<h2>Лидерборд</h2>
				<p>Данные лидерборда пока недоступны</p>
			</div>
		</div>
	)
}

export default Leaderboard
