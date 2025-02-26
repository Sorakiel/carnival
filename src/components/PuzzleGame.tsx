import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Modal from './Modal'
import './PuzzleGame.css'

function PuzzleGame() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [timeLeft, setTimeLeft] = useState(120) // 2 минуты в секундах
	const puzzleNames: string[] = [
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
	const [placedPieces, setPlacedPieces] = useState<number[]>(Array(36).fill(-1))
	const [availablePieces, setAvailablePieces] = useState<number[]>(
		Array.from({ length: 36 }, (_, i) => i)
	)
	const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
	const [showModal, setShowModal] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [timeSpent, setTimeSpent] = useState(0)
	const [score, setScore] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(timer)
					handleGameOver(false)
				}
				return prev > 0 ? prev - 1 : 0
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	useEffect(() => {
		const updateVisiblePieces = () => {
			const containerWidth =
				document.querySelector('.pieces-carousel')?.clientWidth || 0
			const pieceWidth = 76 // 64px + 12px gap
			const maxPieces = Math.floor(containerWidth / pieceWidth)
			setVisiblePieces(Math.min(8, maxPieces))
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

	// Обработчик выбора кусочка пазла
	const handlePieceSelect = (pieceIndex: number) => {
		if (!availablePieces.includes(pieceIndex)) return
		setSelectedPiece(pieceIndex)
	}

	// Обработчик размещения кусочка на поле
	const handleCellClick = (cellIndex: number) => {
		if (selectedPiece === null || placedPieces[cellIndex] !== -1) return

		// Размещаем выбранный кусочек на поле
		setPlacedPieces(prev => {
			const newPlacedPieces = [...prev]
			newPlacedPieces[cellIndex] = selectedPiece
			return newPlacedPieces
		})

		// Удаляем кусочек из доступных
		setAvailablePieces(prev => prev.filter(p => p !== selectedPiece))

		// Сбрасываем выбранный кусочек
		setSelectedPiece(null)
	}

	// Добавим обработчик возврата кусочка
	const handlePieceReturn = (cellIndex: number) => {
		const piece = placedPieces[cellIndex]
		if (piece === -1) return

		// Возвращаем кусочек в доступные
		setAvailablePieces(prev => [...prev, piece])

		// Удаляем кусочек с поля
		setPlacedPieces(prev => {
			const newPlacedPieces = [...prev]
			newPlacedPieces[cellIndex] = -1
			return newPlacedPieces
		})
	}

	// Проверка завершения пазла
	const isPuzzleComplete = () => {
		return !placedPieces.includes(-1)
	}

	// Функция проверки правильности сборки
	const checkPuzzle = () => {
		// В данном примере считаем, что индекс кусочка соответствует его правильной позиции
		return placedPieces.every((piece, index) => piece === index)
	}

	// Вычисление счета на основе оставшегося времени
	const calculateScore = (timeLeft: number) => {
		const maxTime = 120 // Максимальное время в секундах
		const score = Math.round((timeLeft / maxTime) * 10)
		return Math.min(10, Math.max(0, score)) // Ограничиваем счет от 0 до 10
	}

	// Обработка окончания игры
	const handleGameOver = (completed: boolean) => {
		const success = completed && checkPuzzle()
		const timeSpent = 120 - timeLeft // Вычисляем потраченное время
		const finalScore = success ? calculateScore(timeLeft) : 0

		setIsSuccess(success)
		setTimeSpent(timeSpent)
		setScore(finalScore)
		setShowModal(true)
	}

	const handleModalClose = () => {
		setShowModal(false)
		navigate('/profile')
	}

	const handleReadyClick = () => {
		if (isPuzzleComplete()) {
			handleGameOver(true)
		} else {
			handleGameOver(false)
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
					<div
						key={i}
						className={`puzzle-cell ${
							selectedPiece !== null && placedPieces[i] === -1
								? 'selectable'
								: ''
						}`}
						onClick={() => handleCellClick(i)}
						onDoubleClick={() => handlePieceReturn(i)}
						style={
							{
								'--row': Math.floor(i / 6),
								'--col': i % 6,
							} as React.CSSProperties
						}
					>
						{placedPieces[i] !== -1 && (
							<img
								src={`/src/assets/pieces/puzzle_${id}/piece (${
									placedPieces[i] + 1
								}).png`}
								alt={`Piece ${placedPieces[i] + 1}`}
								draggable={false}
							/>
						)}
					</div>
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
						{availablePieces.map(i => (
							<div
								key={i}
								className={`puzzle-piece ${
									selectedPiece === i ? 'selected' : ''
								}`}
								onClick={() => handlePieceSelect(i)}
							>
								<img
									src={`/src/assets/pieces/puzzle_${id}/piece (${i + 1}).png`}
									alt={`Piece ${i + 1}`}
									style={{ width: '100%', height: '100%' }}
									draggable={false}
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

			<button className='ready-button' onClick={handleReadyClick}>
				Готово
			</button>

			{showModal && (
				<Modal
					isSuccess={isSuccess}
					timeSpent={timeSpent}
					score={score}
					onClose={handleModalClose}
				/>
			)}
		</div>
	)
}

export default PuzzleGame
