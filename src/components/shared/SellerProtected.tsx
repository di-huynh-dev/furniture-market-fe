import { selectSellerAuth } from '@/redux/reducers/seller/sellerAuthSlice'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import SellerHeader from '../Header/SellerHeader'
import DrawerSide from '../DrawerSide/DrawerSide'
import { StompSessionProvider } from 'react-stomp-hooks'
import { SOCKET_REGISTER_URL } from '@/libs/socker-client'

const Protected = () => {
  const user = useSelector(selectSellerAuth)

  if (user.authData.user.role !== 'SELLER') return <Navigate to="/seller/login" />
  return (
    <div className="bg-gray-100">
      <>
        <StompSessionProvider url={SOCKET_REGISTER_URL}>
          <SellerHeader />
        </StompSessionProvider>
        <DrawerSide />
      </>
    </div>
  )
}

export default Protected
