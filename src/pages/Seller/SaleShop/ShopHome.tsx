/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingComponent } from '@/components'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { BuyerProductCard } from '@/pages/Buyer'
import { ProductDetailType } from '@/types/product.type'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { CiShoppingBasket, CiChat1, CiStar } from 'react-icons/ci'
import { FiUserPlus } from 'react-icons/fi'
import { PiUsersFourThin } from 'react-icons/pi'
import { useParams } from 'react-router-dom'

type CategoryType = {
  id: string
  name: string
}

const ShopHome = () => {
  const { id } = useParams()
  const [initialLoad, setInitialLoad] = useState(true)
  const [categoryName, setCategoryName] = useState('')
  const [productList, setProductList] = useState<ProductDetailType[]>([])
  const [activeTab, setActiveTab] = useState('')
  const [sortByPrice, setSortByPrice] = useState('ASC')

  useEffect(() => {
    if (initialLoad && id) {
      getProductsByCategoryMutation.mutate({ categoryName: categoryName })
      setInitialLoad(false)
    }
  }, [id, initialLoad])

  const { data: shop_profile, isLoading: shop_profile_loading } = useQuery({
    queryKey: [Buyer_QueryKeys.SHOP_PROFILE],
    queryFn: async () => {
      const resp = await axiosClient.get(`/store/${id}`)
      return resp.data.data
    },
    enabled: !!id,
  })

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
        `/product/search-filter?storeCategories.contains=${categoryName}&store.equals=id,${id}&sort=price.${sortByPrice}`,
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

  if (shop_profile_loading || shop_categories_loading) return <LoadingComponent />

  return (
    <div>
      <div className=" bg-white shadow-md">
        <div className="align-element my-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="flex items-center gap-2 ">
                <img src={shop_profile?.logo} alt="logo" className="rounded-full w-32 h-32" />
                <div className="">
                  <p className="text-lg font-bold">{shop_profile?.shopName}</p>
                  <p className="text-sm text-gray-500">{shop_profile?.address}</p>
                </div>
              </div>
              <div className="flex gap-2 my-2">
                <button className="btn btn-sm btn-primary text-white">+ Theo dõi</button>
                <button className="btn btn-sm btn-outline">Chat</button>
              </div>
            </div>
            <div className="grid grid-cols-3 col-span-2">
              {gridItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-6 h-6 text-primary" />}
                  <span>
                    {item.label}: <span className="text-primary">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div role="tablist" className="tabs tabs-lifted mt-4">
            <a
              role="tab"
              className={`tab ${
                activeTab === '' ? 'tab-active text-primary font-bold [--tab-border-color:orange]' : ''
              }`}
              onClick={() => handleTabClick('')}
            >
              Tất cả
            </a>
            {shop_categories.length > 0 &&
              shop_categories.map((category: CategoryType) => (
                <a
                  key={category.id}
                  role="tab"
                  className={`tab ${
                    activeTab === category.name ? 'tab-active  font-bold text-primary [--tab-border-color:orange]' : ''
                  }`}
                  onClick={() => handleTabClick(category.name)}
                >
                  {category.name}
                </a>
              ))}
          </div>
        </div>
      </div>
      {/* <div className="align-element bg-white shawdow-md my-10">
        <div className="p-10">
          <p>VOUCHER CỦA SHOP</p>
          <div className="grid grid-cols-3 gap-4">
            <div className=" max-w-sm bg-orange-100 border-2 border-gray-300 border-dashed ">
              <div className="p-4 grid grid-cols-3 items-center">
                <div className="col-span-2">
                  <p>Giảm giá 10k</p>
                  <p>Đơn tối thiểu 199k</p>
                  <p className="text-sm">HSD: 31.04.2022</p>
                </div>
                <button className="btn btn-sm btn-primary text-white">Lưu</button>
              </div>
            </div>
            <div className=" max-w-sm bg-orange-100 border-2 border-gray-300 border-dashed ">
              <div className="p-4 grid grid-cols-3 items-center">
                <div className="col-span-2">
                  <p>Giảm giá 10k</p>
                  <p>Đơn tối thiểu 199k</p>
                  <p className="text-sm">HSD: 31.04.2022</p>
                </div>
                <button className="btn btn-sm btn-primary text-white">Lưu</button>
              </div>
            </div>
            <div className=" max-w-sm bg-orange-100 border-2 border-gray-300 border-dashed ">
              <div className="p-4 grid grid-cols-3 items-center">
                <div className="col-span-2">
                  <p>Giảm giá 10k</p>
                  <p>Đơn tối thiểu 199k</p>
                  <p className="text-sm">HSD: 31.04.2022</p>
                </div>
                <button className="btn btn-sm btn-primary text-white">Lưu</button>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div> */}

      <div className="align-element bg-white shawdow-md">
        <div className="p-10">
          <div className="grid grid-cols-5 gap-2 items-center bg-gray-200 rounded-md p-2">
            <p>Bộ lọc</p>
            <button className="btn btn-outline btn-primary btn-sm w-40">Mới nhất</button>
            <button className="btn btn-outline btn-primary btn-sm w-40">Phổ biến nhất</button>
            <select
              className="select w-full max-w-xs"
              value={sortByPrice}
              onChange={(e) => {
                setSortByPrice(e.target.value)
                getProductsByCategoryMutation.mutate({ categoryName: categoryName })
              }}
            >
              <option value="ASC">Theo giá: Thấp đến cao</option>
              <option value="DESC">Theo giá: Cao đến thấp</option>
            </select>
          </div>
          <p>Danh sách sản phẩm</p>
          {productList.length > 0 ? (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-x-4 gap-y-6 my-10">
              {productList.map((product) => (
                <BuyerProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <p className="text-error">Chưa có sản phẩm nào</p>
          )}
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default ShopHome
