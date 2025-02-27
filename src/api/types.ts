export interface LoginResponse {
	status: string
	access_token: string
}

export interface RegisterResponse extends LoginResponse {}

export interface RegisterRequest {
	username: string
	password: string
	first_name: string
	last_name: string
	high_school: number
}

export interface LoginRequest {
	username: string
	password: string
}

export interface UserInfo {
	username: string
	first_name: string
	last_name: string
	high_school: number
	collected_puzzles: number
}

export interface PuzzleInfo {
	id: number
	name: string
	image: string
	assembled: boolean
	score: number | null
	time_spent: number | null
}

export interface LeaderboardEntry {
	position: number
	full_name: string
	photo_url: string | null
	score: number
}

export interface LeaderboardResponse {
	leaderboard: LeaderboardEntry[]
	me: {
		position: number
		score: number
	}
}

export interface SavePuzzleRequest {
	puzzle_id: number
	score: number
	time_spent: number
}
