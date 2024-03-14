import Logo from '@/assets/Logo/Logo1.png'

import { NavLink } from 'react-router-dom'

const BuyerHeader = () => {
  return (
    <div
      className="bg-base-100 text-base-content sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] 
  
  "
    >
      <div className="navbar max-w-screen-xl px-4 py-2 flex lg:py-10">
        <div className="navbar">
          <div className="navbar-start">
            <NavLink to="/" className="w-[200px]">
              <img src={Logo} alt="" />
            </NavLink>
          </div>
          <div className="lg:navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 ">
              <li>
                <button className="btn btn-ghost">Trang chủ</button>
              </li>
              <li>
                <button className="btn btn-ghost">Sản phẩm</button>
              </li>
              <li>
                <button className="btn btn-ghost">Fnest mall</button>
              </li>
              <li>
                <button className="btn btn-ghost">Về chúng tôi</button>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            <div className="form-control">
              <input type="text" placeholder="Tìm kiếm" className="input input-bordered w-24 md:w-auto" />
            </div>
            <div className="flex-none mx-1">
              <button className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerHeader
