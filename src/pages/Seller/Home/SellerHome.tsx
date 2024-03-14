import { SellerHeader } from '@/components'
import { Outlet } from 'react-router-dom'

const SellerHome = () => {
  return (
    <>
      <SellerHeader />
      <Outlet />
    </>
  )
}

export default SellerHome
