import { BuyerHeader, TopHeader } from '@/components'
import { Outlet } from 'react-router-dom'

const Landing = () => {
  return (
    <>
      <TopHeader />
      <BuyerHeader />
      <Outlet />
      {/* <BuyerFooter /> */}
    </>
  )
}

export default Landing
