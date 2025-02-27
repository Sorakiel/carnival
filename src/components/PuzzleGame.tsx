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
				console.log('Полученные пазлы:', puzzles)
				const puzzle = puzzles.find(p => p.id === Number(id))
				console.log('ID текущего пазла:', id)
				console.log('Найденный пазл:', puzzle)
				if (puzzle) {
					setPuzzleInfo(puzzle)
					// Добавляем проверку путей
					const testPath = `/assets/pieces/puzzle_${puzzle.id}/piece (1).png`
					console.log('Тестовый путь к кусочку:', testPath)
					const img = new Image()
					img.onload = () =>
						console.log('Тестовое изображение загружено успешно')
					img.onerror = () =>
						console.error('Ошибка загрузки тестового изображения')
					img.src = testPath
				} else {
					setError('Пазл не найден')
				}
			} catch (err) {
				console.error('Ошибка при загрузке пазла:', err)
				setError('Ошибка загрузки данных пазла')
			} finally {
				setIsLoading(false)
			}
		}

		console.log('Начинаем загрузку пазла с ID:', id)
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

	// Добавляем функцию для предзагрузки изображений
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
						img.src = `/assets/pieces/puzzle_${puzzleInfo.id}/piece (${
							i + 1
						}).png`
					})
				})

				try {
					await Promise.allSettled(promises)
					console.log('Все доступные изображения загружены')
				} catch (error) {
					console.error('Ошибка при загрузке изображений:', error)
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
	const handleGameOver = async (completed: boolean) => {
		const success = completed && checkPuzzle()
		const timeSpent = 120 - timeLeft
		const finalScore = success ? calculateScore(timeLeft) : 0

		// Останавливаем таймер при успешной сборке
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

	// Обработчики для двойного нажатия
	const handleTouchStart = (cellIndex: number) => {
		if (placedPieces[cellIndex] === -1) return

		const currentTime = Date.now()
		const tapInterval = currentTime - lastTapTime

		if (tapInterval < 300 && lastTapIndex === cellIndex) {
			// Двойное нажатие в течение 300мс
			handlePieceReturn(cellIndex)
		}

		setLastTapTime(currentTime)
		setLastTapIndex(cellIndex)
	}

	const handleTouchEnd = () => {
		// Оставляем пустым, так как нам больше не нужно очищать таймер
	}

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
				<h2>{puzzleNames[Number(id) - 1]}</h2>
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
