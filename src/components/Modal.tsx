import './Modal.css'

interface ModalProps {
	isSuccess: boolean
	timeSpent: number
	score: number
	onClose: () => void
}

function Modal({ isSuccess, timeSpent, score, onClose }: ModalProps) {
	return (
		<div className='modal-overlay'>
			<div className='modal-content'>
				{isSuccess ? (
					<>
						<h2>Пазл собран!</h2>
						<p>
							Вы потратили {timeSpent} секунд!
							<br />
							Вы заработали {score}/10 баллов!
						</p>
						<button className='modal-button success' onClick={onClose}>
							Вернуться
						</button>
					</>
				) : (
					<>
						<h2>Неудача!</h2>
						<p>Попробуй в следующий раз!</p>
						<button className='modal-button failure' onClick={onClose}>
							Вернуться
						</button>
					</>
				)}
			</div>
		</div>
	)
}

export default Modal
