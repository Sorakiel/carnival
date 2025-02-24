import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Auth from './components/Auth'
import CollectedPuzzles from './components/CollectedPuzzles'
import Header from './components/Header'
import Leaderboard from './components/Leaderboard'
import Profile from './components/Profile'
import PuzzleGame from './components/PuzzleGame'
import PuzzleList from './components/PuzzleList'
import Registration from './components/Registration'
import TabBar from './components/TabBar'

function App() {
	return (
		<Router>
			<div className='app-container'>
				<Routes>
					<Route
						path='/'
						element={
							<>
								<Header />
								<Auth />
							</>
						}
					/>
					<Route
						path='/registration'
						element={
							<>
								<Header />
								<Registration />
							</>
						}
					/>
					<Route
						path='/profile'
						element={
							<>
								<Header />
								<Profile />
								<TabBar />
							</>
						}
					/>
					<Route
						path='/puzzles'
						element={
							<>
								<Header />
								<PuzzleList />
								<TabBar />
							</>
						}
					/>
					<Route
						path='/puzzle/:id'
						element={
							<>
								<Header />
								<PuzzleGame />
								<TabBar />
							</>
						}
					/>
					<Route
						path='/collected-puzzles'
						element={
							<>
								<Header />
								<CollectedPuzzles />
								<TabBar />
							</>
						}
					/>
					<Route
						path='/leaderboard'
						element={
							<>
								<Header />
								<Leaderboard />
								<TabBar />
							</>
						}
					/>
				</Routes>
			</div>
		</Router>
	)
}

export default App
