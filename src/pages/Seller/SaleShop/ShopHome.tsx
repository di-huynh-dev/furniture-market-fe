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
  const [sort, setSort] = useState('')
  const [evaluate, setEvaluate] = useState(0)
  const [reportReason, setReportReason] = useState('')
  const [reportDescription, setReportDescription] = useState('')

  useEffect(() => {
    scrollTo(0, 0)
    document.title = 'Fnest - Cửa hàng'
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
      if (!user.authData.accessToken) {
        toast.error('Vui đăng nhập để theo dõi!')
        return
      }
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
        `/product/search-filter?sort=${sort}&storeCategories.contains=${categoryName}&store.equals=id,${id}&totalReviewPoint.min=${evaluate}`,
      )
      return resp.data.data.content
    },
    onSuccess: (data: ProductDetailType[]) => {
      setProductList(data)
    },
    onError: (error: any) => {
      toast.error(error.response.data.message[0])
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

  const handleReportShop = async () => {
    try {
      if (!user.authData.accessToken) {
        toast.error('Vui đăng nhập để gửi báo cáo')
        const dialog = document.getElementById('my_modal_3') as HTMLDialogElement
        dialog.close()
        return
      }
      if (!reportReason || !reportDescription) {
        toast.error('Vui lòng điền đầy đủ thông tin')
        return
      }

      const resp = await axiosPrivate.post(`/user/report`, {
        reason: reportReason,
        description: reportDescription,
        type: 'STORE_REPORT',
        reporterName: user.authData.user.email,
        objectId: id,
      })
      if (resp.status === 200) {
        setReportReason('')
        setReportDescription('')
        const dialog = document.getElementById('my_modal_3') as HTMLDialogElement
        dialog.close()
        toast.success(resp.data.messages[0])
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  if (shop_profile_loading || shop_categories_loading) return <LoadingComponent />

  return (
    <>
      <dialog className="modal" id="my_modal_3">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Báo cáo shop vi phạm!</h3>
          <select className="select select-primary w-full my-2" onChange={(e) => setReportReason(e.target.value)}>
            <option disabled selected>
              Chọn lý do
            </option>
            <option value="Người bán có đăng sản phẩm cấm">Người bán có đăng sản phẩm cấm</option>
            <option value="Người dùng có dấu hiệu lừa đảo">Người dùng có dấu hiệu lừa đảo</option>
            <option value="Người bán có đăng sản phẩm giả/nhái">Người bán có đăng sản phẩm giả/nhái</option>
            <option value="Người dùng phát tán tin nhắn/hình ảnh/video có nội dung không lịch sự">
              Người dùng phát tán tin nhắn/hình ảnh/video có nội dung không lịch sự
            </option>
            <option value="Người dùng thực hiện giao dịch ngoài sàn">Người dùng thực hiện giao dịch ngoài sàn</option>
            <option value="Vi phạm quyền riêng tư">Vi phạm quyền riêng tư</option>
            <option value="Người dùng đăng tải nội dung/hình ảnh thô tục, phản cảm">
              Người dùng đăng tải nội dung/hình ảnh thô tục, phản cảm
            </option>
            <option value="Lí do khác">Lí do khác</option>
          </select>
          <textarea
            placeholder="Mô tả báo cáo (10-150 kí tự)"
            className="textarea textarea-bordered textarea-primary w-full mt-2 resize-vertical"
            rows={3}
            maxLength={150}
            onChange={(e) => setReportDescription(e.target.value)}
          ></textarea>
          <div className="modal-action flex">
            <button className="btn btn-primary text-white" onClick={handleReportShop}>
              Gửi
            </button>
            <button
              className="btn"
              onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).close()}
            >
              Hủy
            </button>
          </div>
        </div>
      </dialog>
      {user.authData?.user?.id && (
        <StompSessionProvider url={SOCKET_REGISTER_URL}>
          <ChatCenter showChat={showChat} toggleChat={toggleChat} receiver={receiver} />
        </StompSessionProvider>
      )}
      <div className=" bg-white shadow-md">
        <div className="align-element">
          {shop_profile.topBanner && (
            <img src={shop_profile.topBanner} alt="Top Banner" className=" max-h-[350px] w-full object-cover  " />
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
                        <li
                          onClick={() => {
                            const dialog = document.getElementById('my_modal_3') as HTMLDialogElement
                            dialog.showModal()
                          }}
                        >
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
        <img
          src={shop_profile.infoBanner}
          alt="Top Banner"
          className=" align-element w-full max-h-[550px] object-cover my-2"
        />
      )}

      <div className="align-element bg-white shawdow-md my-2">
        <div className="grid grid-cols-5 gap-2 items-center rounded-md p-4">
          <p>Sắp xếp theo</p>
          <button
            onClick={() => {
              setSort('createdAt.ASC')
              getProductsByCategoryMutation.mutate({ categoryName: categoryName })
            }}
            className="btn btn-outline btn-error btn-sm w-40"
          >
            Mới nhất
          </button>
          <button
            onClick={() => {
              setSort('sold.ASC')
              getProductsByCategoryMutation.mutate({ categoryName: categoryName })
            }}
            className="btn btn-outline btn-error btn-sm w-40"
          >
            Bán chạy nhất
          </button>
          <select
            className="select w-full max-w-xs"
            onChange={(e) => {
              setSort(e.target.value)
              getProductsByCategoryMutation.mutate({ categoryName: categoryName })
            }}
          >
            <option>Theo giá</option>
            <option value={'price.DESC'}>Giá thấp</option>
            <option value={'price.ASC'}>Giá cao</option>
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
          <p className="text-center  my-10">Danh mục này hiện chưa có sản phẩm được bán</p>
        )}
      </div>
    </>
  )
}

export default ShopHome
