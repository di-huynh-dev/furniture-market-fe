import { Navigate } from 'react-router-dom'

interface ProtectedProps {
  children: React.ReactNode
}

const Protected = ({ children }: ProtectedProps) => {
  const isAuth = false
  if (!isAuth) return <Navigate to="/login" />
  return <>{children}</>
}

export default Protected
