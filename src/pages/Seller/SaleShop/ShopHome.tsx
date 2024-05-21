/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingComponent } from '@/components'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { BuyerProductCard, ChatCenter } from '@/pages/Buyer'
import { ProductDetailType } from '@/types/product.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { CiShoppingBasket, CiChat1, CiStar, CiLocationOn } from 'react-icons/ci'
import { FiUserPlus } from 'react-icons/fi'
import { PiUsersFourThin } from 'react-icons/pi'
import { useParams } from 'react-router-dom'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { IoIosSend } from 'react-icons/io'
import { FaFlag } from 'react-icons/fa'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import toast from 'react-hot-toast'
import { selectAuth } from '@/redux/reducers/authSlice'
import { useSelector } from 'react-redux'
import useToggleChat from '@/hooks/useToggleChat'
import { StompSessionProvider } from 'react-stomp-hooks'
import { SOCKET_REGISTER_URL } from '@/libs/socker-client'

type CategoryType = {
  id: string
  name: string
}

const ShopHome = () => {
  const { id } = useParams()
  const user = useSelector(selectAuth)
  const axiosPrivate = useAxiosBuyerPrivate()
  const { showChat, toggleChat } = useToggleChat()
  const [receiver, setReceiver] = useState({ id: id || '', name: '' })
  const client = useQueryClient()
  const [initialLoad, setInitialLoad] = useState(true)
  const [categoryName, setCategoryName] = useState('')
  const [productList, setProductList] = useState<ProductDetailType[]>([])
  const [activeTab, setActiveTab] = useState('')
  const [sortByPrice, setSortByPrice] = useState('ASC')
  const [evaluate, setEvaluate] = useState(0)

  useEffect(() => {
    scrollTo(0, 0)
  }, [])

  const { data: shop_profile, isLoading: shop_profile_loading } = useQuery({
    queryKey: [Buyer_QueryKeys.SHOP_PROFILE],
    queryFn: async () => {
      if (user.authData.accessToken) {
        const resp = await axiosPrivate.get(`/store/${id}`)
        return resp.data.data
      } else {
        const resp = await axiosClient.get(`/store/${id}`)
        return resp.data.data
      }
    },
    enabled: !!id,
  })

  const handleFollow = async () => {
    try {
      const resp = await axiosPrivate.post(`/user/connection?id=${id}`)
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        client.invalidateQueries({ queryKey: [Buyer_QueryKeys.SHOP_PROFILE] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  useEffect(() => {
    if (initialLoad && id) {
      getProductsByCategoryMutation.mutate({ categoryName: categoryName })
      setInitialLoad(false)
    }
  }, [id, initialLoad])

  const handleTabClick = (selectedCategory: string) => {
    setActiveTab(selectedCategory)
    setCategoryName(selectedCategory)
    getProductsByCategoryMutation.mutate({ categoryName: selectedCategory })
  }

  const { data: shop_categories, isLoading: shop_categories_loading } = useQuery({
    queryKey: [Buyer_QueryKeys.SHOP_CATEGORIES],
    queryFn: async () => {
      const resp = await axiosClient.get(`/category/store/${id}`)
      return resp.data.data
    },
    enabled: !!id,
  })

  const getProductsByCategoryMutation = useMutation({
    mutationFn: async ({ categoryName }: { categoryName: string }) => {
      const resp = await axiosClient.get(
        `/product/search-filter?storeCategories.contains=${categoryName}&store.equals=id,${id}&sort=price.${sortByPrice}&totalReviewPoint.min=${evaluate}`,
      )
      return resp.data.data.content
    },
    onSuccess: (data: ProductDetailType[]) => {
      setProductList(data)
    },
    onError: (error: string) => {
      console.log(error)
    },
  })

  const gridItems = [
    { icon: CiShoppingBasket, label: 'Tổng sản phẩm', value: shop_profile?.productAmount },
    { icon: FiUserPlus, label: 'Đang theo dõi', value: shop_profile?.numFollower },
    { icon: PiUsersFourThin, label: 'Người theo dõi', value: shop_profile?.numFollower },
    { icon: CiChat1, label: 'Tổng số đánh giá', value: shop_profile?.numReview },
    { icon: CiStar, label: 'Điểm đánh giá', value: shop_profile?.avgReviewStar },
  ]

  const handleSentMessage = () => {
    if (user.authData.accessToken) {
      setReceiver({ id: id || '', name: shop_profile?.name || '' })
      toggleChat()
    } else {
      toast.error('Vui lòng đăng nhập để gửi tin nhắn!')
    }
  }

  if (shop_profile_loading || shop_categories_loading) return <LoadingComponent />

  return (
    <>
      {user.authData?.user?.id && (
        <StompSessionProvider url={SOCKET_REGISTER_URL}>
          <ChatCenter showChat={showChat} toggleChat={toggleChat} receiver={receiver} />
        </StompSessionProvider>
      )}
      <div className=" bg-white shadow-md">
        <div className="align-element">
          {shop_profile.topBanner && (
            <img src={shop_profile.topBanner} alt="Top Banner" className=" max-h-[350px] w-full" />
          )}
          <div className="grid grid-cols-3 gap-2">
            <div className="border p-2 rounded-md border-base-300">
              <div className="flex items-center gap-2 ">
                <img src={shop_profile?.logo} alt="logo" className="rounded-full w-32 h-32" />
                <div className="">
                  <p className="text-xl font-bold">{shop_profile?.shopName}</p>
                  <div className="flex gap-1">
                    <CiLocationOn />
                    <p className="text-sm text-gray-500 italic">{shop_profile?.address}</p>
                  </div>
                  <div className="flex gap-4 my-2">
                    <button onClick={handleFollow} className="btn btn-sm btn-error text-white">
                      {shop_profile?.followed ? 'Đang theo dõi' : 'Theo dõi'}
                    </button>
                    <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-sm">
                        <BsThreeDotsVertical />
                      </div>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li onClick={handleSentMessage}>
                          <a>
                            <IoIosSend />
                            Gửi tin nhắn
                          </a>
                        </li>
                        <li>
                          <a>
                            <FaFlag />
                            Báo cáo
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 col-span-2">
              {gridItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-6 h-6" />}
                  <span className="font-semibold text-neutral">
                    {item.label}: <span className="text-red-500">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2 items-center mt-4">
            <div role="tablist" className="tabs tabs-lifted capitalize col-span-5">
              <a
                role="tab"
                className={`tab ${
                  activeTab === '' ? 'tab-active text-primary font-bold [--tab-border-color:primary]' : ''
                }`}
                onClick={() => handleTabClick('')}
              >
                Tất cả
              </a>
              {shop_categories.slice(0, 5).map((category: CategoryType) => (
                <a
                  key={category.id}
                  role="tab"
                  className={`tab ${
                    activeTab === category.name
                      ? 'tab-active font-semibold text-primary [--tab-border-color:primary]'
                      : ''
                  }`}
                  onClick={() => handleTabClick(category.name)}
                >
                  {category.name}
                </a>
              ))}
            </div>
            <div className="col-span-1">
              {shop_categories.length > 5 && (
                <select value={activeTab} onChange={(e) => handleTabClick(e.target.value)} className="select w-full">
                  <option>Xem thêm</option>
                  {shop_categories.slice(5).map((category: CategoryType) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>

      {shop_profile.infoBanner && activeTab === '' && (
        <img src={shop_profile.infoBanner} alt="Top Banner" className=" align-element w-full" />
      )}

      <div className="align-element bg-white shawdow-md my-2">
        <div className="grid grid-cols-5 gap-2 items-center rounded-md p-4">
          <p>Sắp xếp theo</p>
          <button className="btn btn-outline btn-error btn-sm w-40">Mới nhất</button>
          <button className="btn btn-outline btn-error btn-sm w-40">Phổ biến nhất</button>
          <select
            className="select w-full max-w-xs"
            value={sortByPrice}
            onChange={(e) => {
              setSortByPrice(e.target.value)
              getProductsByCategoryMutation.mutate({ categoryName: categoryName })
            }}
          >
            <option>Theo giá</option>
            <option value="ASC">Theo giá: Thấp đến cao</option>
            <option value="DESC">Theo giá: Cao đến thấp</option>
          </select>
          <select
            className="select w-full max-w-xs"
            value={evaluate}
            onChange={(e) => {
              setEvaluate(parseInt(e.target.value, 10))
              getProductsByCategoryMutation.mutate({ categoryName: categoryName })
            }}
          >
            <option>Đánh giá</option>
            <option value={5}>5 sao</option>
            <option value={4}>4 sao trở lên</option>
            <option value={3}>3 sao trở lên</option>
            <option value={2}>2 sao trở lên</option>
            <option value={1}>1 sao trở lên</option>
          </select>
        </div>
      </div>
      <div className="align-element">
        {productList.length > 0 ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-x-4 gap-y-6 my-10">
            {productList.map((product) => (
              <BuyerProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-error mt-10">Chưa có sản phẩm nào thuộc danh mục này được bán</p>
        )}
      </div>
    </>
  )
}

export default ShopHome
