import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PuzzleList.css'

interface Puzzle {
	id: number
	name: string
}

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

function PuzzleList() {
	const [puzzles] = useState<Puzzle[]>(
		Array.from({ length: 12 }, (_, i) => ({
			id: i,
			name: puzzleNames[i],
		}))
	)
	const navigate = useNavigate()

	return (
		<div className='puzzle-list'>
			{puzzles.map(puzzle => (
				<div key={puzzle.id} className='puzzle-item'>
					<img
						src={`/src/assets/puzzles/puzzle_${puzzle.id}.jpg`}
						alt={puzzle.name}
					/>
					<div className='puzzle-info'>
						<h3>{puzzle.name}</h3>
						<button
							className='collect-button'
							onClick={() => navigate(`/puzzle/${puzzle.id}`)}
						>
							Собрать
						</button>
					</div>
				</div>
			))}
		</div>
	)
}

export default PuzzleList
