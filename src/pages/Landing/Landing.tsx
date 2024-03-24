import { BuyerHeader, TopHeader } from '@/components'
import { Outlet } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="">
      <TopHeader />
      <BuyerHeader />
      <Outlet />
      {/* <BuyerFooter /> */}
    </div>
  )
}

export default Landing
