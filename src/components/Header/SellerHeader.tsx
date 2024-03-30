import Logo from '@/assets/Logo/saller-logo.png'
import { CiBellOn } from 'react-icons/ci'
import { CgMenuGridO } from 'react-icons/cg'
import { removeAuth, selectSellerAuth } from '@/redux/reducers/seller/sellerAuthSlice'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { ConfirmModal } from '..'
import toast from 'react-hot-toast'

const SellerHeader = () => {
  const user = useSelector(selectSellerAuth)
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
    <header className="shadow-md navbar bg-base-100 text-base-content sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)]">
      <ConfirmModal content="Bạn có muốn đăng xuất" onClick={handleLogout} />
      <div className="navbar bg-base-100">
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <img src={Logo} alt="" className="" />
          <p className="text-xl ">Fnest Kênh người bán</p>
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
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  />
                </div>
              </div>
              <p>{user.authData.user.fullName}</p>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Trang cá nhân
                  <span className="badge">New</span>
                </a>
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
