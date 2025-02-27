import { Navigate } from 'react-router-dom'
import { getAuthToken } from '../api/api'

interface PrivateRouteProps {
	children: React.ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps) {
	const token = getAuthToken()

	if (!token) {
		return <Navigate to='/' replace />
	}

	return <>{children}</>
}

export default PrivateRoute
