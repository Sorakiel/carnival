import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPuzzlesInfo } from '../api/api'
import { PuzzleInfo } from '../api/types'
import './CollectedPuzzles.css'

function CollectedPuzzles() {
	const navigate = useNavigate()
	const [puzzles, setPuzzles] = useState<PuzzleInfo[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const fetchPuzzles = async () => {
			try {
				const data = await getPuzzlesInfo()
				setPuzzles(data.filter(puzzle => puzzle.assembled))
			} catch (err) {
				setError('Не удалось загрузить собранные пазлы')
			} finally {
				setIsLoading(false)
			}
		}

		fetchPuzzles()
	}, [])

	return (
		<div className='collected-puzzles-container'>
			<div className='back-button-container'>
				<button className='back-button' onClick={() => navigate('/profile')}>
					Назад
				</button>
			</div>
			<div className='collected-puzzles-content'>
				<h2>Собранные пазлы</h2>
				{isLoading ? (
					<p>Загрузка...</p>
				) : error ? (
					<p className='error-message'>{error}</p>
				) : puzzles.length === 0 ? (
					<p>У вас пока нет собранных пазлов</p>
				) : (
					<div className='collected-puzzles-list'>
						{puzzles.map((puzzle, index) => (
							<div key={puzzle.id} className='collected-puzzle-item'>
								<img
									src={`/assets/puzzles/puzzle_${index}.jpg`}
									alt={puzzle.name}
								/>
								<div className='puzzle-info'>
									<h3>{puzzle.name}</h3>
									<p className='score'>Счёт: {puzzle.score}/10</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default CollectedPuzzles
