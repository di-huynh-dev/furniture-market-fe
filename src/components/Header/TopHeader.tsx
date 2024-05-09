import { Link, NavLink } from 'react-router-dom'
import { FaRegBell } from 'react-icons/fa6'
import { IoBagHandleOutline } from 'react-icons/io5'
import { IoMdHeartEmpty } from 'react-icons/io'
import { CiUser } from 'react-icons/ci'
import { seller_routes } from '../../constants/routes-link'
import { useSelector } from 'react-redux'
import { removeAuth, selectAuth } from '@/redux/reducers/authSlice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { selectCart } from '@/redux/reducers/buyer/cartSlice'

const TopHeader = () => {
  const user = useSelector(selectAuth)
  const cartNum = useSelector(selectCart)
  const dispatch = useDispatch()
  const handleLogout = async () => {
    dispatch(removeAuth())
    toast.success('Đăng xuất thành công!')
  }

  return (
    <div className="bg-white">
      <header className="py-4 align-element text-sm lg:flex justify-between text-gray-700 hidden ">
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
          <ul className="flex space-x-4 items-center">
            <li>
              <NavLink to="discounts" className="text-gray-600 hover:text-black flex  items-center">
                <FaRegBell className="mr-1" />
                Thông báo
              </NavLink>
            </li>
            <li>
              <NavLink to="buyer/cart" className="text-gray-600 hover:text-black flex  items-center">
                <IoBagHandleOutline className="mr-1" />
                Giỏ hàng ({cartNum.cartTotalQuantity})
              </NavLink>
            </li>
            <li>
              <NavLink to="buyer/whishlist" className="text-gray-600 hover:text-black flex  items-center">
                <IoMdHeartEmpty className="mr-1" />
                Yêu thích
              </NavLink>
            </li>
            <li>
              {user.authData.accessToken ? (
                <div className="dropdown dropdown-end flex items-center">
                  <div>
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                      <div className="w-10 rounded-full">
                        <img alt="Tailwind CSS Navbar component" src={user.authData.user.avatar} />
                      </div>
                    </div>
                    <ul
                      tabIndex={0}
                      className="mt-3 z-[100] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <Link to={'/buyer/account'} className="justify-between">
                          Hồ sơ của bạn
                          <span className="badge">New</span>
                        </Link>
                      </li>
                      <li>
                        <Link to={'/buyer/account/purchase'}>Đơn mua</Link>
                      </li>
                      <li onClick={handleLogout}>
                        <a>Đăng xuất</a>
                      </li>
                    </ul>
                  </div>
                  <span className="font-semibold">{user.authData.user.fullName}</span>
                </div>
              ) : (
                <NavLink to="buyer/login" className="text-gray-600 hover:text-black flex items-center">
                  <CiUser className="mr-1" />
                  Tài khoản
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </div>
  )
}

export default TopHeader
