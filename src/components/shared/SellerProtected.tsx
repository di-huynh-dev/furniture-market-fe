import { selectSellerAuth } from '@/redux/reducers/seller/sellerAuthSlice'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import SellerHeader from '../Header/SellerHeader'
import DrawerSide from '../DrawerSide/DrawerSide'

const Protected = () => {
  const user = useSelector(selectSellerAuth)

  if (user.authData.user.role !== 'SELLER') return <Navigate to="/seller/login" />
  return (
    <div className="bg-gray-100">
      <SellerHeader />
      <DrawerSide />
    </div>
  )
}

export default Protected
