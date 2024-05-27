import { Outlet } from 'react-router-dom'
import TabNavigation from './components/TabNavigation'
import { useEffect } from 'react'

const Setting = () => {
  useEffect(() => {
    scrollTo(0, 0)
    document.title = 'Fnest - Thông tin tài khoản'
  }, [])

  return (
    <section className="mx-4 my-2 text-sm">
      <TabNavigation />
      <Outlet />
    </section>
  )
}

export default Setting
