import { Outlet } from 'react-router-dom'
import TabNavigation from './components/TabNavigation'

const Setting = () => {
  return (
    <section className="mx-4 my-2 text-sm">
      <TabNavigation />
      <Outlet />
    </section>
  )
}

export default Setting
