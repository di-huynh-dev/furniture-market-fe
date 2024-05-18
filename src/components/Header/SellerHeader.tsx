import Logo from '@/assets/Logo/logo-color.svg'
import { CiBellOn } from 'react-icons/ci'
import { CgMenuGridO } from 'react-icons/cg'
import { removeAuth, selectSellerAuth } from '@/redux/reducers/seller/sellerAuthSlice'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { ConfirmModal } from '..'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

const SellerHeader = () => {
  const user = useSelector(selectSellerAuth)
  const navigation = useNavigate()
  const dispatch = useDispatch()

  const showModal = () => {
    const modalElement = document.getElementById('confirm_modal') as HTMLDialogElement
    if (modalElement) {
      modalElement.showModal()
    }
  }
  const handleLogout = () => {
    dispatch(removeAuth())
    toast.success('Đăng xuất tài khoản thành công!')
  }

  return (
    <header className="shadow-md bg-base-100 text-base-content sticky top-0 z-30 flex h-24 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)]">
      <ConfirmModal content="Bạn có muốn đăng xuất" onClick={handleLogout} />
      <div className="navbar bg-base-100">
        <button onClick={() => navigation('/seller')} tabIndex={0} className="flex-none">
          <img src={Logo} alt="" className="w-24 h-24 object-cover" />
        </button>
        <div className="flex-1">
          <p className="text-xl font-bold text-neutral">Fnest Kênh người bán</p>
        </div>
        <div className="flex-none">
          <div className="hidden flex-none items-center lg:block">
            <div className="dropdown dropdown-hover  dropdown-bottom dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost drawer-button font-normal">
                <CgMenuGridO className="w-8 h-8" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="hidden flex-none items-center lg:block">
            <div className="dropdown dropdown-hover  dropdown-bottom dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost drawer-button font-normal">
                <CiBellOn className="w-8 h-8" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="dropdown dropdown-end">
            <div className="flex items-center justify-center">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user.authData.user.avatar} alt="" />
                </div>
              </div>
              <p>{user.authData.user.fullName}</p>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/seller/settings/profile" className="justify-between">
                  Trang cá nhân
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <a>Cài đặt</a>
              </li>
              <li onClick={showModal}>
                <a>Đăng xuất</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SellerHeader
