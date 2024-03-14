import { Navigate } from 'react-router-dom'

interface ProtectedProps {
  children: React.ReactNode
}

const Protected = ({ children }: ProtectedProps) => {
  const isAuth = true
  if (!isAuth) return <Navigate to="/seller/login" />
  return <>{children}</>
}

export default Protected
