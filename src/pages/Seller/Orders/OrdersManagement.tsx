import { Outlet } from 'react-router-dom'
import TabNavigation from './components/TabNavigation'

const OrdersManagement = () => {
  return (
    <div className="shadow-lg m-2 bg-white">
      <TabNavigation />
      <div className="m-2">
        <Outlet />
      </div>
    </div>
  )
}

export default OrdersManagement
