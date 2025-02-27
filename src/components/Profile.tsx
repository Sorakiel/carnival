import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserInfo, logout } from '../api/api'
import { UserInfo } from '../api/types'
import './Profile.css'
import collectedIcon from '/assets/icons/collected.svg'
import leaderboardIcon from '/assets/icons/leaderboard.svg'
import progressbarIcon from '/assets/icons/progressbar.svg'

function Profile() {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isExiting, setIsExiting] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')
	const totalPuzzles = 11
	const navigate = useNavigate()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userData = await getUserInfo()
				setUserInfo(userData)
			} catch (err) {
				setError('Не удалось загрузить данные')
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [])

	const handleLogout = () => {
		logout()
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

	if (isLoading) {
		return (
			<div className='profile-container'>
				<p>Загрузка...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className='profile-container'>
				<p className='error-message'>{error}</p>
			</div>
		)
	}

	return (
		<div className='profile-container'>
			<div className='profile-header'>
				<div className='name-container'>
					<div className='name-row'>
						<h2>
							{userInfo
								? `${userInfo.first_name} ${userInfo.last_name}`
								: 'Загрузка...'}
						</h2>
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
								style={{
									width: `${
										((userInfo?.collected_puzzles || 0) / totalPuzzles) * 100
									}%`,
								}}
							/>
						</div>
						<span className='progress-count'>
							{userInfo?.collected_puzzles || 0}/{totalPuzzles}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Profile
