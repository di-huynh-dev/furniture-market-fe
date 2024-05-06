import { selectAuth } from '@/redux/reducers/authSlice'
import { useState } from 'react'
import { BiSolidBellRing, BiUser } from 'react-icons/bi'
import { BsCashStack, BsCheck } from 'react-icons/bs'
import { PiNewspaperClippingThin } from 'react-icons/pi'
import { useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'

const Sidenav = () => {
  const [isListVisible, setIsListVisible] = useState(true)
  const user = useSelector(selectAuth)
  return (
    <div className="my-2 lg:mx-0 mx-4 lg:text-base text-sm capitalize">
      <Link to="/buyer/account" className="pb-6 border-b-2 hover:cursor-pointer">
        <label tabIndex={0} className="flex items-center space-x-3">
          <div className="avatar online">
            <div className="lg:w-24 w-16 rounded-full">
              <img src={user.authData.user.avatar} />
            </div>
          </div>
          <div>
            <div className="font-bold">Xin chào,</div>
            <span className="font-bold">{user.authData.user.fullName}</span>
            <div className="flex items-center space-x-2"></div>
          </div>
        </label>
      </Link>
      <div className="my-5 ">
        <div className="flex items-center space-x-2 py-2" onClick={() => setIsListVisible(!isListVisible)}>
          <BiUser className="text-primary" />
          <span>Tài khoản của tôi</span>
        </div>
        <div className="pl-6">
          <ul className={isListVisible ? 'block' : 'hidden'}>
            <li className="py-1 flex items-center">
              <BsCheck className="text-green" />
              <NavLink to="/buyer/account">Thông tin</NavLink>
            </li>
            <li className="py-1 flex items-center">
              <BsCheck className="text-green" />
              <NavLink to="/buyer/account/address">Địa Chỉ</NavLink>
            </li>
            <li className="py-1 flex items-center">
              <BsCheck className="text-green" />
              <NavLink to="/buyer/account/wallet">Ví của tôi</NavLink>
            </li>
          </ul>
        </div>
        <NavLink to="/buyer/account/purchase" className="flex items-center space-x-2 pb-2">
          <PiNewspaperClippingThin className="text-primary" />
          <span>Đơn mua</span>
        </NavLink>
        <div>
          <div className="flex items-center space-x-2 py-2" onClick={() => setIsListVisible(!isListVisible)}>
            <BiSolidBellRing className="text-primary" />
            <span>Thông báo</span>
          </div>
          <div className="pl-6 ">
            <ul className={isListVisible ? 'block' : 'hidden'}>
              <li className="py-1 flex items-center">
                <BsCheck className="text-green" />
                <NavLink to="/buyer/account/notifications/order">Cập nhật đơn hàng</NavLink>
              </li>
              <li className="py-1 flex items-center">
                <BsCheck className="text-green" />
                <NavLink to="/buyer/account/address">Khuyến mãi</NavLink>
              </li>
              <li className="py-1 flex items-center">
                <BsCheck className="text-green" />
                <NavLink to="/buyer/account/notifications/system">Hệ thống</NavLink>
              </li>
            </ul>
          </div>
        </div>
        <NavLink to="/buyer/account/vouchers" className="flex items-center space-x-2 pb-2">
          <BsCashStack className="text-primary" />
          <span>Voucher</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidenav
