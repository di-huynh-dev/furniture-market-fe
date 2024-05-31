/* eslint-disable @typescript-eslint/no-explicit-any */
import commonApi from '@/api/commonApi'
import Logo from '@/assets/Logo/Logo1.png'
import axiosClient from '@/libs/axios-client'
import { removeAuth, selectAuth } from '@/redux/reducers/authSlice'
import { ProductDetailType } from '@/types/product.type'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai'
import { FaBarsStaggered } from 'react-icons/fa6'
import { FiBell, FiList } from 'react-icons/fi'
import { IoHomeOutline } from 'react-icons/io5'
import { PiArmchairLight, PiHandHeartLight, PiHeart, PiShoppingBag } from 'react-icons/pi'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const BuyerHeader = () => {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('###@#@#@#')
  const [productList, setProductList] = useState([])
  const user = useSelector(selectAuth)
  const dispatch = useDispatch()

  const searchMutation = useMutation({
    mutationFn: async () => {
      const resp = await axiosClient.get(`/product/search-filter?name.contains=${keyword}`)
      return resp
    },
    onSuccess: (resp) => {
      setProductList(resp.data.data.content)
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    },
  })

  const handleSearch = () => {
    searchMutation.mutate()
  }

  const handleLogout = async () => {
    dispatch(removeAuth())
    toast.success('Đăng xuất tài khoản thành công!')
    await commonApi.logout()
  }

  return (
    <div
      className="bg-base-100 text-base-content sticky top-0 z-30 flex h-20 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] 
  
  "
    >
      <div className="navbar max-w-screen-xl px-4 py-2 flex lg:py-10">
        <div className="navbar">
          <div className="navbar-start">
            <NavLink to="/" className="md:w-[200px] w-[100px]">
              <img src={Logo} alt="" className="w-[200px] object-cover" />
            </NavLink>
          </div>
          <div className="lg:navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 text-lg">
              <li>
                <NavLink to="/" className="btn btn-ghost capitalize">
                  Trang chủ
                </NavLink>
              </li>
              <li>
                <NavLink to="/products" className="btn btn-ghost capitalize">
                  Sản phẩm
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="btn btn-ghost capitalize">
                  Về chúng tôi
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            <div className="form-control">
              <div className="input-group dropdown dropdown-bottom flex">
                <input
                  tabIndex={0}
                  role="button"
                  type="text"
                  onChange={(e) => {
                    setKeyword(e.target.value)
                    handleSearch()
                  }}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="input input-bordered input-xs md:input-md w-[120px] md:w-full text-xs"
                />
                {productList.length > 0 && (
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
                    {productList?.map((product: ProductDetailType) => (
                      <li className="w-full" key={product.id}>
                        <div className="grid grid-cols-6 gap-2">
                          <img src={product.images[0]} alt={product.name} className="w-20" />
                          <div className="col-span-5">
                            <Link to={`/product/${product.id}`} className="w-full">
                              <p className="text-sm">{product.name}</p>
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button className="ml-2" onClick={() => navigate(`/search/${keyword}`)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="md:h-6 md:w-6 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="drawer drawer-end lg:hidden block md:navbar-start">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content flex justify-end">
                <label htmlFor="my-drawer" className="btn btn-ghost drawer-button md:btn-md btn-sm">
                  <FaBarsStaggered className="md:h-6 md:w-6 w-4 h-4 order-last" />
                </label>
              </div>
              <div className="drawer-side z-[100]">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <aside className="min-h-screen menu p-4 w-1/2 bg-base-200 text-base-content">
                  <ul className="">
                    <>
                      {user.authData.accessToken && (
                        <NavLink to="buyer/account" className="w-10 rounded-full flex items-center gap-2 my-2">
                          <img src={user.authData.user.avatar} className="rounded-full" />
                          <h1 className="font-bold text-sm">Chào,{user?.authData.user.fullName}</h1>
                        </NavLink>
                      )}
                    </>
                    <li>
                      <NavLink to="/">
                        <IoHomeOutline />
                        Trang chủ
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="products">
                        <PiArmchairLight />
                        Sản phẩm
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="about">
                        <PiHandHeartLight />
                        Về chúng tôi
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="buyer/cart">
                        <PiShoppingBag />
                        Giỏ hàng
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="buyer/whishlist">
                        <PiHeart />
                        Yêu thích
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="buyer/account/purchase">
                        <FiList />
                        Đơn mua
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="buyer/account/notifications/order">
                        <FiBell />
                        Thông báo
                      </NavLink>
                    </li>
                    <li>
                      {!user.authData.accessToken ? (
                        <NavLink to="buyer/login">
                          <AiOutlineLogin />
                          Đăng nhập
                        </NavLink>
                      ) : (
                        <p
                          onClick={() => {
                            const dialog = document.getElementById('logout') as HTMLDialogElement
                            dialog.showModal()
                          }}
                        >
                          <AiOutlineLogout />
                          Đăng xuất
                        </p>
                      )}
                    </li>
                  </ul>
                  <dialog id="logout" className="modal">
                    <div className="modal-box max-w-lg">
                      <h3 className="font-bold text-2xl text-center">ĐĂNG XUẤT TÀI KHOẢN</h3>
                      <form className="my-2" onSubmit={handleLogout}>
                        <div className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</div>
                        <div className="text-center">
                          <p className="my-10">Bạn chắc chắn đăng xuất?</p>
                          <div className="flex items-center mt-3 text-center justify-center">
                            <button className="btn btn-primary text-white">Xác nhận</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </dialog>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerHeader
