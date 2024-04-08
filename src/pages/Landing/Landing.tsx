import { BuyerHeader, TopHeader } from '@/components'
import { Outlet } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="bg-[#EDECEF]">
      <TopHeader />
      <BuyerHeader />
      <Outlet />
      {/* <BuyerFooter /> */}
    </div>
  )
}

export default Landing
