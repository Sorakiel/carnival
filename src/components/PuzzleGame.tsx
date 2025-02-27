import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPuzzlesInfo, savePuzzleProgress } from '../api/api'
import { PuzzleInfo } from '../api/types'
import Modal from './Modal'
import './PuzzleGame.css'

function PuzzleGame() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [timeLeft, setTimeLeft] = useState(120) // 2 минуты в секундах
	const [puzzleInfo, setPuzzleInfo] = useState<PuzzleInfo | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')

	const [placedPieces, setPlacedPieces] = useState<number[]>(Array(36).fill(-1))
	const [availablePieces, setAvailablePieces] = useState<number[]>(
		Array.from({ length: 36 }, (_, i) => i)
	)
	const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
	const [showModal, setShowModal] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [timeSpent, setTimeSpent] = useState(0)
	const [score, setScore] = useState(0)
	const [isSaving, setIsSaving] = useState(false)
	const [loadedPieces, setLoadedPieces] = useState<Set<number>>(new Set())
	const [lastTapTime, setLastTapTime] = useState<number>(0)
	const [lastTapIndex, setLastTapIndex] = useState<number | null>(null)
	const [timer, setTimer] = useState<number | null>(null)

	useEffect(() => {
		const fetchPuzzleInfo = async () => {
			try {
				const puzzles = await getPuzzlesInfo()
				const puzzle = puzzles.find(p => p.id === Number(id))
				if (puzzle) {
					setPuzzleInfo(puzzle)
				} else {
					setError('Пазл не найден')
				}
			} catch (err) {
				setError('Ошибка загрузки данных пазла')
			} finally {
				setIsLoading(false)
			}
		}

		fetchPuzzleInfo()
	}, [id])

	useEffect(() => {
		const newTimer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(newTimer)
					handleGameOver(false)
				}
				return prev > 0 ? prev - 1 : 0
			})
		}, 1000)

		setTimer(newTimer)

		return () => {
			if (newTimer) clearInterval(newTimer)
		}
	}, [])

	// Предзагрузка изображений
	useEffect(() => {
		if (puzzleInfo) {
			const preloadImages = async () => {
				const promises = Array.from({ length: 36 }, (_, i) => {
					return new Promise((resolve, reject) => {
						const img = new Image()
						img.onload = () => {
							setLoadedPieces(prev => new Set([...prev, i]))
							resolve(true)
						}
						img.onerror = reject
						img.src = `/assets/pieces/puzzle_${
							puzzleInfo.id - 1
						}/piece (${i}).png`
					})
				})

				try {
					await Promise.allSettled(promises)
				} catch (error) {
					// Обработка ошибок загрузки изображений внутри Promise
				}
			}

			preloadImages()
		}
	}, [puzzleInfo])

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

	// Выбор кусочка пазла
	const handlePieceSelect = (pieceIndex: number) => {
		if (!availablePieces.includes(pieceIndex)) return
		setSelectedPiece(pieceIndex)
	}

	// Размещение кусочка на поле
	const handleCellClick = (cellIndex: number) => {
		if (selectedPiece === null || placedPieces[cellIndex] !== -1) return

		// Размещение выбранного кусочка
		setPlacedPieces(prev => {
			const newPlacedPieces = [...prev]
			newPlacedPieces[cellIndex] = selectedPiece
			return newPlacedPieces
		})

		// Удаление кусочка из доступных
		setAvailablePieces(prev => prev.filter(p => p !== selectedPiece))

		// Сброс выбранного кусочка
		setSelectedPiece(null)
	}

	// Возврат кусочка
	const handlePieceReturn = (cellIndex: number) => {
		const piece = placedPieces[cellIndex]
		if (piece === -1) return

		// Возврат кусочка в доступные
		setAvailablePieces(prev => [...prev, piece])

		// Удаление кусочка с поля
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

	// Проверка правильности сборки
	const checkPuzzle = () => {
		return placedPieces.every((piece, index) => piece === index)
	}

	// Вычисление счета
	const calculateScore = (timeLeft: number) => {
		const maxTime = 120 // Максимальное время в секундах
		const score = Math.round((timeLeft / maxTime) * 10)
		return Math.min(10, Math.max(0, score)) // Ограничение счета от 0 до 10
	}

	// Обработка окончания игры
	const handleGameOver = async (completed: boolean) => {
		const success = completed && checkPuzzle()
		const timeSpent = 120 - timeLeft
		const finalScore = success ? calculateScore(timeLeft) : 0

		// Остановка таймера при успешной сборке
		if (success && timer) {
			clearInterval(timer)
		}

		setIsSuccess(success)
		setTimeSpent(timeSpent)
		setScore(finalScore)
		setShowModal(true)

		if (success && puzzleInfo) {
			setIsSaving(true)
			try {
				await savePuzzleProgress({
					puzzle_id: puzzleInfo.id,
					score: finalScore,
					time_spent: timeSpent,
				})
			} catch (error) {
				console.error('Ошибка сохранения прогресса:', error)
			} finally {
				setIsSaving(false)
			}
		}
	}

	const handleModalClose = () => {
		if (!isSaving) {
			setShowModal(false)
			navigate('/profile')
		}
	}

	const handleReadyClick = () => {
		if (isPuzzleComplete()) {
			handleGameOver(true)
		} else {
			handleGameOver(false)
		}
	}

	// Обработка двойного нажатия
	const handleTouchStart = (cellIndex: number) => {
		if (placedPieces[cellIndex] === -1) return

		const currentTime = Date.now()
		const tapInterval = currentTime - lastTapTime

		if (tapInterval < 300 && lastTapIndex === cellIndex) {
			// Возврат кусочка по двойному нажатию
			handlePieceReturn(cellIndex)
		}

		setLastTapTime(currentTime)
		setLastTapIndex(cellIndex)
	}

	const handleTouchEnd = () => {}

	if (isLoading) {
		return <div className='puzzle-game'>Загрузка...</div>
	}

	if (error || !puzzleInfo) {
		return <div className='puzzle-game'>{error || 'Пазл не найден'}</div>
	}

	return (
		<div className='puzzle-game'>
			<div className='back-button-container'>
				<button className='back-button' onClick={() => navigate('/puzzles')}>
					Назад
				</button>
			</div>
			<div className='game-header'>
				<h2>{puzzleInfo.name}</h2>
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
						} ${lastTapIndex === i ? 'touched' : ''}`}
						onClick={() => handleCellClick(i)}
						onDoubleClick={() => handlePieceReturn(i)}
						onTouchStart={() => handleTouchStart(i)}
						onTouchEnd={handleTouchEnd}
						onTouchCancel={handleTouchEnd}
						style={
							{
								'--row': Math.floor(i / 6),
								'--col': i % 6,
							} as React.CSSProperties
						}
					>
						{placedPieces[i] !== -1 && loadedPieces.has(placedPieces[i]) && (
							<img
								src={`/assets/pieces/puzzle_${puzzleInfo.id}/piece (${
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
									src={`/assets/pieces/puzzle_${puzzleInfo.id}/piece (${
										i + 1
									}).png`}
									alt={`Piece ${i + 1}`}
									style={{ width: '100%', height: '100%' }}
									draggable={false}
									onLoad={() => {
										setLoadedPieces(prev => new Set([...prev, i]))
									}}
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
