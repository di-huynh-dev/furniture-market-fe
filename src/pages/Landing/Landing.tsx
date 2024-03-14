import { BuyerHeader, BuyerFooter, TopHeader } from '@/components'
import { Outlet } from 'react-router-dom'

const Landing = () => {
  return (
    <>
      <TopHeader />
      <BuyerHeader />
      Landing
      <Outlet />
      <BuyerFooter />
    </>
  )
}

export default Landing
