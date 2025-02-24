import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './PuzzleGame.css'

function PuzzleGame() {
	const { id } = useParams()
	const [timeLeft, setTimeLeft] = useState(120) // 2 минуты в секундах
	const puzzleNames: string[] = [
		/* массив имен как выше */
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

	const [visiblePieces, setVisiblePieces] = useState(10)

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	useEffect(() => {
		const updateVisiblePieces = () => {
			const containerWidth =
				document.querySelector('.pieces-carousel')?.clientWidth || 0
			const pieceWidth = 76 // 64px + 12px gap
			const maxPieces = Math.floor(containerWidth / pieceWidth)
			setVisiblePieces(Math.min(8, maxPieces)) // Уменьшаем максимум до 8 из-за увеличенного размера
		}

		updateVisiblePieces()
		window.addEventListener('resize', updateVisiblePieces)
		return () => window.removeEventListener('resize', updateVisiblePieces)
	}, [])

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
	}

	const scrollCarousel = (direction: 'left' | 'right') => {
		const container = document.querySelector('.pieces-container')
		if (container) {
			const pieceWidth = 92 // 80px + 12px gap
			const visibleWidth = container.clientWidth
			const scrollAmount = Math.floor(visibleWidth / pieceWidth) * pieceWidth

			if (direction === 'right') {
				container.scrollBy({
					left: scrollAmount,
					behavior: 'smooth',
				})
			} else {
				container.scrollBy({
					left: -scrollAmount,
					behavior: 'smooth',
				})
			}
		}
	}

	return (
		<div className='puzzle-game'>
			<div className='game-header'>
				<h2>{puzzleNames[Number(id)]}</h2>
				<div className='timer'>{formatTime(timeLeft)}</div>
			</div>

			<div className='puzzle-board'>
				{Array.from({ length: 36 }, (_, i) => (
					<div key={i} className='puzzle-cell' />
				))}
			</div>

			<div className='carousel-wrapper'>
				<button
					className='carousel-button left'
					onClick={() => scrollCarousel('left')}
				>
					‹
				</button>
				<div className='pieces-carousel'>
					<div className='pieces-container'>
						{Array.from({ length: 36 }, (_, i) => (
							<div key={i} className='puzzle-piece'>
								<img
									src={`/src/assets/pieces/puzzle_${id}/piece (${i + 1}).png`}
									alt={`Piece ${i + 1}`}
									style={{ width: '100%', height: '100%' }}
								/>
							</div>
						))}
					</div>
				</div>
				<button
					className='carousel-button right'
					onClick={() => scrollCarousel('right')}
				>
					›
				</button>
			</div>

			<button className='ready-button'>Готово</button>
		</div>
	)
}

export default PuzzleGame
