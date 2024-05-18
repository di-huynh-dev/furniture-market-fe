import Logo from '@/assets/Logo/Logo1.png'
import axiosClient from '@/libs/axios-client'
import { ProductDetailType } from '@/types/product.type'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const BuyerHeader = () => {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('###@#@#@#')
  const [productList, setProductList] = useState([])

  const searchMutation = useMutation({
    mutationFn: async () => {
      const resp = await axiosClient.get(`/product/search-filter?name.contains=${keyword}`)
      return resp
    },
    onSuccess: (resp) => {
      setProductList(resp.data.data.content)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const handleSearch = () => {
    searchMutation.mutate()
  }

  return (
    <div
      className="bg-base-100 text-base-content sticky top-0 z-30 flex h-20 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)] 
  
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
            <ul className="menu menu-horizontal px-1 text-lg">
              <li>
                <NavLink to="/">Trang chủ</NavLink>
              </li>
              <li>
                <NavLink to="/products">Sản phẩm</NavLink>
              </li>
              <li>
                <NavLink to="/about">Về chúng tôi</NavLink>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            <div className="form-control">
              <div className="input-group dropdown dropdown-bottom">
                <input
                  tabIndex={0}
                  role="button"
                  type="text"
                  onChange={(e) => {
                    setKeyword(e.target.value)
                    handleSearch()
                  }}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="input input-bordered"
                />
                {productList.length > 0 && (
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
                    {productList?.map((product: ProductDetailType) => (
                      <li className="w-full" key={product.id}>
                        <div className="grid grid-cols-6 gap-2">
                          <img src={product.images[0]} alt={product.name} className="w-20" />
                          <div className="col-span-5">
                            <a className="w-full">{product.name}</a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <button className="ml-2" onClick={() => navigate(`/search/${keyword}`)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerHeader
