import { useLocation, useNavigate } from 'react-router-dom'
import './TabBar.css'
import profileIcon from '/assets/icons/profile.svg'
import puzzlesIcon from '/assets/icons/puzzles.svg'

function TabBar() {
	const navigate = useNavigate()
	const location = useLocation()

	return (
		<div className='tab-bar'>
			<div
				className={`tab-item ${
					location.pathname === '/puzzles' ? 'active' : ''
				}`}
				onClick={() => navigate('/puzzles')}
			>
				<img src={puzzlesIcon} alt='Puzzles' />
				<span>Пазлы</span>
			</div>
			<div
				className={`tab-item ${
					location.pathname === '/profile' ? 'active' : ''
				}`}
				onClick={() => navigate('/profile')}
			>
				<img src={profileIcon} alt='Profile' />
				<span>Профиль</span>
			</div>
		</div>
	)
}

export default TabBar
