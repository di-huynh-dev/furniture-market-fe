import { selectSellerAuth } from '@/redux/reducers/seller/sellerAuthSlice'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

interface ProtectedProps {
  children: React.ReactNode
}

const Protected = ({ children }: ProtectedProps) => {
  const user = useSelector(selectSellerAuth)

  if (user.authData.user.role !== 'SELLER') return <Navigate to="/seller/login" />
  return <>{children}</>
}

export default Protected
