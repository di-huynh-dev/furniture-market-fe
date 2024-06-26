import { Outlet } from 'react-router-dom'
import Sidenav from './components/Sidenav'
import { useEffect } from 'react'

const BuyerAccount = () => {
  useEffect(() => {
    document.title = 'Fnest - Tài khoản cá nhân'
  }, [])
  return (
    <div className="align-element grid md:grid-cols-4 gap-2 md:mt-10 lg:mb-30 mb-10">
      <Sidenav />
      <div className="card md:col-span-3 bg-white shadow-lg">
        <Outlet />
      </div>
    </div>
  )
}

export default BuyerAccount
