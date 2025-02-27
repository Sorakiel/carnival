import {
	LeaderboardEntry,
	LeaderboardResponse,
	LoginRequest,
	LoginResponse,
	PuzzleInfo,
	RegisterRequest,
	RegisterResponse,
	SavePuzzleRequest,
	UserInfo,
} from './types'

const API_BASE_URL = 'https://maslen-back.itc-hub.ru/api/v1'

export const getAuthToken = () => localStorage.getItem('auth_token')

const getHeaders = () => {
	const token = getAuthToken()
	return {
		'Content-Type': 'application/json',
		...(token ? { Authorization: token } : {}),
	}
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
	const response = await fetch(`${API_BASE_URL}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		throw new Error('Ошибка авторизации')
	}

	const result = await response.json()
	localStorage.setItem('auth_token', result.access_token)
	return result
}

export const register = async (
	data: RegisterRequest
): Promise<RegisterResponse> => {
	const response = await fetch(`${API_BASE_URL}/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		throw new Error('Ошибка регистрации')
	}

	const result = await response.json()
	localStorage.setItem('auth_token', result.access_token)
	return result
}

export const getUserInfo = async (): Promise<UserInfo> => {
	const response = await fetch(`${API_BASE_URL}/user/`, {
		method: 'POST',
		headers: getHeaders(),
	})

	if (!response.ok) {
		throw new Error('Ошибка получения данных пользователя')
	}

	return response.json()
}

export const getPuzzlesInfo = async (): Promise<PuzzleInfo[]> => {
	const response = await fetch(`${API_BASE_URL}/puzzles/info/`, {
		headers: getHeaders(),
	})

	if (!response.ok) {
		throw new Error('Ошибка получения информации о пазлах')
	}

	return response.json()
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
	const response = await fetch(`${API_BASE_URL}/leaderboard`, {
		headers: getHeaders(),
	})

	if (!response.ok) {
		throw new Error('Ошибка получения лидерборда')
	}

	const data: LeaderboardResponse = await response.json()
	return data.leaderboard || []
}

export const savePuzzleProgress = async (
	data: SavePuzzleRequest
): Promise<void> => {
	const token = getAuthToken()
	const url = `${API_BASE_URL}/savepuzzles`
	const requestData = {
		puzzle_id: Number(data.puzzle_id),
		score: Number(data.score),
		time_spent: Number(data.time_spent),
	}

	console.log('Отправка данных:', {
		url,
		headers: {
			'Content-Type': 'application/json',
			Authorization: token,
		},
		data: requestData,
	})

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: token || '',
		},
		body: JSON.stringify(requestData),
	})

	if (!response.ok) {
		console.error('Ошибка ответа:', {
			status: response.status,
			statusText: response.statusText,
			url: response.url,
			requestData,
		})
		throw new Error('Ошибка сохранения прогресса')
	}

	const result = await response.json()
	console.log('Ответ сервера:', result)
}

export const logout = () => {
	localStorage.removeItem('auth_token')
}
