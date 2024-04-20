import { selectAuth } from '@/redux/reducers/authSlice'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

interface ProtectedProps {
  children: React.ReactNode
}

const Protected = ({ children }: ProtectedProps) => {
  const user = useSelector(selectAuth)

  if (user.authData.user.role !== 'BUYER') return <Navigate to="/buyer/login" />
  return <>{children}</>
}

export default Protected
