import { useNavigate } from 'react-router-dom'
import './CollectedPuzzles.css'

function CollectedPuzzles() {
	const navigate = useNavigate()

	return (
		<div className='collected-puzzles-container'>
			<div className='back-button-container'>
				<button className='back-button' onClick={() => navigate('/profile')}>
					Назад
				</button>
			</div>
			<div className='collected-puzzles-content'>
				<h2>Собранные пазлы</h2>
				<p>У вас пока нет собранных пазлов</p>
			</div>
		</div>
	)
}

export default CollectedPuzzles
