import { NavLink } from 'react-router-dom'
import { FaRegBell } from 'react-icons/fa6'
import { IoBagHandleOutline } from 'react-icons/io5'
import { IoMdHeartEmpty } from 'react-icons/io'
import { CiUser } from 'react-icons/ci'
import { seller_routes } from '../../constants/routes-link'

const TopHeader = () => {
  return (
    <>
      <header className="py-4 align-element text-sm lg:flex justify-between text-gray-700 hidden">
        <nav className="flex justify-between">
          <ul className="flex space-x-4">
            <li>
              <NavLink to={seller_routes.seller} className="text-black font-semibold">
                Kênh người bán
              </NavLink>
            </li>
            <li>
              <NavLink to="discounts" className="text-gray-600 hover:text-black">
                Mã giảm giá
              </NavLink>
            </li>
            <li>
              <NavLink to="discounts" className="text-gray-600 hover:text-black">
                Giới thiệu
              </NavLink>
            </li>
            <li>
              <NavLink to="discounts" className="text-gray-600 hover:text-black">
                Khuyến mãi
              </NavLink>
            </li>
          </ul>
        </nav>

        <nav className="flex justify-between">
          <ul className="flex space-x-4">
            <li>
              <NavLink to="discounts" className="text-gray-600 hover:text-black flex  items-center">
                <FaRegBell className="mr-1" />
                Thông báo
              </NavLink>
            </li>
            <li>
              <NavLink to="discounts" className="text-gray-600 hover:text-black flex  items-center">
                <IoBagHandleOutline className="mr-1" />
                Giỏ hàng (10)
              </NavLink>
            </li>
            <li>
              <NavLink to="discounts" className="text-gray-600 hover:text-black flex  items-center">
                <IoMdHeartEmpty className="mr-1" />
                Yêu thích (3)
              </NavLink>
            </li>
            <li>
              <NavLink to="buyer/login" className="text-gray-600 hover:text-black flex items-center">
                <CiUser className="mr-1" />
                Tài khoản
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}

export default TopHeader
