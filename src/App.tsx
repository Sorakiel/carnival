import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Auth from './components/Auth'
import CollectedPuzzles from './components/CollectedPuzzles'
import Header from './components/Header'
import Leaderboard from './components/Leaderboard'
import PrivateRoute from './components/PrivateRoute'
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
							<PrivateRoute>
								<>
									<Header />
									<Profile />
									<TabBar />
								</>
							</PrivateRoute>
						}
					/>
					<Route
						path='/puzzles'
						element={
							<PrivateRoute>
								<>
									<Header />
									<PuzzleList />
									<TabBar />
								</>
							</PrivateRoute>
						}
					/>
					<Route
						path='/puzzle/:id'
						element={
							<PrivateRoute>
								<>
									<Header />
									<PuzzleGame />
									<TabBar />
								</>
							</PrivateRoute>
						}
					/>
					<Route
						path='/collected-puzzles'
						element={
							<PrivateRoute>
								<>
									<Header />
									<CollectedPuzzles />
									<TabBar />
								</>
							</PrivateRoute>
						}
					/>
					<Route
						path='/leaderboard'
						element={
							<PrivateRoute>
								<>
									<Header />
									<Leaderboard />
									<TabBar />
								</>
							</PrivateRoute>
						}
					/>
				</Routes>
			</div>
		</Router>
	)
}

export default App
