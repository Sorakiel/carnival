import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import collectedIcon from '../assets/icons/collected.svg'
import leaderboardIcon from '../assets/icons/leaderboard.svg'
import progressbarIcon from '../assets/icons/progressbar.svg'
import './Profile.css'

function Profile() {
	const [collectedCount] = useState(0)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isExiting, setIsExiting] = useState(false)
	const totalPuzzles = 12
	const navigate = useNavigate()

	const handleLogout = () => {
		navigate('/')
	}

	const handleToggleMenu = () => {
		if (isMenuOpen) {
			setIsExiting(true)
			setTimeout(() => {
				setIsMenuOpen(false)
				setIsExiting(false)
			}, 200)
		} else {
			setIsMenuOpen(true)
		}
	}

	return (
		<div className='profile-container'>
			<div className='profile-header'>
				<div className='name-container'>
					<div className='name-row'>
						<h2>Имя Фамилия</h2>
						<div className='dropdown-container'>
							<button
								className={`dropdown-button ${isMenuOpen ? 'active' : ''}`}
								onClick={handleToggleMenu}
							>
								▼
							</button>
							{(isMenuOpen || isExiting) && (
								<button
									className={`logout-button ${
										isExiting ? 'exiting' : 'entering'
									}`}
									onClick={handleLogout}
								>
									Выйти
								</button>
							)}
						</div>
					</div>
					<p className='company-signature'>Сделано ITC</p>
				</div>
			</div>

			<div className='profile-menu'>
				<div
					className='menu-item'
					onClick={() => navigate('/collected-puzzles')}
				>
					<div className='menu-item-left'>
						<img src={collectedIcon} alt='Collected' />
						<span>Собранные пазлы</span>
					</div>
					<span className='arrow'>›</span>
				</div>
				<div className='menu-item' onClick={() => navigate('/leaderboard')}>
					<div className='menu-item-left'>
						<img src={leaderboardIcon} alt='Leaderboard' />
						<span>Лидерборд</span>
					</div>
					<span className='arrow'>›</span>
				</div>
				<div className='menu-item progress-item'>
					<div className='menu-item-left'>
						<img src={progressbarIcon} alt='Progress' />
						<span>Прогресс</span>
					</div>
					<div className='progress-container'>
						<div className='progress-bar'>
							<div
								className='progress-fill'
								style={{ width: `${(collectedCount / totalPuzzles) * 100}%` }}
							/>
						</div>
						<span className='progress-count'>
							{collectedCount}/{totalPuzzles}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Profile
