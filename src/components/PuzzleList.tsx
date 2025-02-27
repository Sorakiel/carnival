import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPuzzlesInfo } from '../api/api'
import { PuzzleInfo } from '../api/types'
import './PuzzleList.css'

function PuzzleList() {
	const [puzzles, setPuzzles] = useState<PuzzleInfo[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')
	const navigate = useNavigate()
	const puzzleNames = [
		'Первый пазл',
		'Второй пазл',
		'Третий пазл',
		'Четвертый пазл',
		'Пятый пазл',
		'Шестой пазл',
		'Седьмой пазл',
		'Восьмой пазл',
		'Девятый пазл',
		'Десятый пазл',
		'Одиннадцатый пазл',
		'Двенадцатый пазл',
	]

	useEffect(() => {
		const fetchPuzzles = async () => {
			try {
				const data = await getPuzzlesInfo()
				// Добавляем названия к данным с сервера
				const puzzlesWithNames = data.map((puzzle, index) => ({
					...puzzle,
					name: puzzleNames[index] || puzzle.name,
				}))
				setPuzzles(puzzlesWithNames)
			} catch (err) {
				setError('Не удалось загрузить список пазлов')
			} finally {
				setIsLoading(false)
			}
		}

		fetchPuzzles()
	}, [])

	if (isLoading) {
		return (
			<div className='puzzle-list'>
				<p>Загрузка...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className='puzzle-list'>
				<p className='error-message'>{error}</p>
			</div>
		)
	}

	return (
		<div className='puzzle-list'>
			{puzzles.map((puzzle, index) => (
				<div key={puzzle.id} className='puzzle-item'>
					<img src={`/assets/puzzles/puzzle_${index}.jpg`} alt={puzzle.name} />
					<div className='puzzle-info'>
						<h3>{puzzle.name}</h3>
						{puzzle.assembled ? (
							<>
								<p className='collected-label'>Собран</p>
								<p className='score'>Счёт: {puzzle.score}/10</p>
							</>
						) : (
							<button
								className='collect-button'
								onClick={() => navigate(`/puzzle/${index + 1}`)}
							>
								Собрать
							</button>
						)}
					</div>
				</div>
			))}
		</div>
	)
}

export default PuzzleList
