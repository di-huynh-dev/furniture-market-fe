/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { CategoryType } from '@/types/category.type'
import { FaFilter, FaRegLightbulb } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import BuyerProductCard from '../Product/Components/BuyerProductCard'
import { ProductDetailType } from '@/types/product.type'
import { LoadingComponent } from '@/components'
import { toast } from 'react-toastify'

const BuyerSearch = () => {
  const { keyword } = useParams()
  const [productList, setProductList] = useState([])
  const [sort, setSort] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(12)
  const [totalPages, setTotalPages] = useState(0)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(50000000)
  const [location, setLocation] = useState(' ')
  const [selectedCategory, setSelectedCategory] = useState(' ')
  const [totalReviewPointMin, setTotalReviewPointMin] = useState(0)
  const [totalReviewPointMax, setTotalReviewPointMax] = useState(5)

  useEffect(() => {
    searchMutation.mutate()
  }, [keyword])

  const searchMutation = useMutation({
    mutationFn: async () => {
      const resp = await axiosClient.get(
        `/product/search-filter?store.contains=address,${location}&sort=${sort}&category.contains=name,${selectedCategory}&name.contains=${keyword}&price.min=${minPrice}&price.max=${maxPrice}&totalReviewPoint.min=${totalReviewPointMin}&totalReviewPoint.max=${totalReviewPointMax}&currentPage=${currentPage}&pageSize=${pageSize}`,
      )
      return resp
    },
    onSuccess: (resp) => {
      const searchData = resp.data.data || {}
      setPageSize(searchData.pageSize)
      setCurrentPage(searchData.currentPage)
      setTotalPages(searchData.totalPages)
      setProductList(resp.data.data.content)
    },
    onError: (error: any) => {
      toast.error(error.response.data.message)
    },
  })

  const { data: systemCategories, isLoading: systemCategoriesIsLoading } = useQuery({
    queryKey: [Buyer_QueryKeys.SYSTEM_CATEGORY],
    queryFn: async () => {
      const resp = await axiosClient.get('/category/system')
      return resp.data.data
    },
  })

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName)
    searchMutation.mutate()
  }

  const handleLocationChange = (selectedLocation: string) => {
    setLocation(selectedLocation)
    searchMutation.mutate()
  }
  if (systemCategoriesIsLoading) return <LoadingComponent />
  return (
    <div className="align-element my-2">
      <div className="md:grid grid-cols-10 gap-2">
        <div className="flex items-center gap-2 col-span-2">
          <FaFilter />
          <p className="text-sm lg:text-base">BỘ LỌC TÌM KIẾM</p>
        </div>
        <div className="col-span-8 md:flex gap-2 my-2 items-center">
          <button
            onClick={() => {
              setSort('sold.ASC')
              searchMutation.mutate()
            }}
            className={sort !== 'sold.ASC' ? 'btn btn-sm bg-white' : 'btn btn-sm bg-primary text-white'}
          >
            Bán chạy
          </button>
          <button
            onClick={() => {
              setSort('createdAt.ASC')
              searchMutation.mutate()
            }}
            className={sort !== 'createdAt.ASC' ? 'btn btn-sm bg-white' : 'btn btn-sm bg-primary text-white'}
          >
            Mới nhất
          </button>
          <div className="flex items-center gap-2 my-2">
            <p>Sắp xếp theo:</p>
            <select
              onChange={(e) => {
                setSort(e.target.value)
                searchMutation.mutate()
              }}
              className="select select-sm select-bordered w-44"
            >
              <option value={''} selected>
                Đề cử
              </option>
              <option value={'price.DESC'}>Giá thấp</option>
              <option value={'price.ASC'}>Giá cao</option>
              <option value={'name.ASC'}>Tên: A-Z</option>
              <option value={'name.DESC'}>Tên: Z-A</option>
            </select>
          </div>
        </div>
      </div>
      <div className="md:grid grid-cols-10 gap-2">
        <div className="col-span-2">
          <div>
            <ul className="menu bg-white w-60 rounded-box min-h-screen p-4">
              <li>
                <details open>
                  <summary className="font-bold">Theo danh mục</summary>
                  <ul>
                    {systemCategories.map((category: CategoryType) => (
                      <li key={category.id}>
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === category.name}
                            onChange={() => handleCategoryChange(category.name)}
                          />
                          <span className="label-text">{category.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
              <li>
                <details open>
                  <summary className="font-bold">Đánh giá</summary>
                  <ul>
                    <li>
                      <button
                        onClick={() => {
                          setTotalReviewPointMin(5)
                          setTotalReviewPointMax(5)
                          searchMutation.mutate()
                        }}
                      >
                        5 <FaStar className="text-yellow-500" />
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setTotalReviewPointMin(4)
                          setTotalReviewPointMax(5)
                          searchMutation.mutate()
                        }}
                      >
                        Từ 4-5 <FaStar className="text-yellow-500" />{' '}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setTotalReviewPointMin(3)
                          setTotalReviewPointMax(5)
                          searchMutation.mutate()
                        }}
                      >
                        Từ 3-5 <FaStar className="text-yellow-500" />
                      </button>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <details open>
                  <summary className="font-bold">Địa điểm</summary>
                  <ul>
                    <li>
                      <button onClick={() => handleLocationChange('Thành phố Hồ Chí Minh')}>TP HCM</button>
                    </li>
                    <li>
                      <button onClick={() => handleLocationChange('Thành phố Hà Nội')}>TP Hà Nội</button>
                    </li>
                    <li>
                      <button onClick={() => handleLocationChange('Thành phố Đà Nẵng')}>Đà Nẵng</button>
                    </li>
                    <li>
                      <button onClick={() => handleLocationChange('Thành phố Quy Nhơn')}>Quy Nhơn</button>
                    </li>
                    <li>
                      <button onClick={() => handleLocationChange('Thành phố Nha Trang')}>Nha Trang</button>
                    </li>
                  </ul>
                </details>
              </li>

              <li>
                <summary className="font-bold">Khoảng giá</summary>
                <ul>
                  <div className="lg:grid grid-cols-3 gap-2 items-center lg:text-center">
                    <p>Thấp nhất</p>
                    <p>-</p>
                    <p>Cao nhất</p>
                  </div>
                  <div className="lg:grid grid-cols-2 gap-2 items-center justify-center">
                    <div>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(parseInt(e.target.value))}
                        className="input input-bordered input-xs w-full  max-w-[100px]"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        className="input input-bordered input-xs max-w-[100px]"
                      />
                    </div>
                  </div>
                  <div className="lg:grid grid-cols-2 gap-1">
                    <div>
                      <button onClick={() => searchMutation.mutate()} className="btn btn-sm max-w-[100px]  w-full my-2">
                        Áp dụng
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setMinPrice(0)
                          setMaxPrice(100000000)
                          searchMutation.mutate()
                        }}
                        className="btn btn-sm  w-full my-2 max-w-[100px]"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-span-8 card bg-white p-4">
          <div className="md:flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaRegLightbulb />
              <p>Có {productList.length} kết quả tìm kiếm cho từ khoá: </p>
              <p className="font-bold text-primary">"{keyword}"</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="text-sm">
                Trang {currentPage + 1}/{totalPages}
              </p>
              <div className="join">
                {Array.from({ length: Math.ceil(totalPages) }, (_, i) => i).map((page) => (
                  <button
                    onClick={() => {
                      setCurrentPage(page)
                      searchMutation.mutate()
                    }}
                    key={page}
                    className={`join-item btn-xs ${
                      page === currentPage ? 'btn btn-active btn-primary text-white' : 'btn'
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="divider"></div>
          {productList.length > 0 ? (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-6 my-4">
              {productList.map((product: ProductDetailType) => (
                <BuyerProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-error mt-10">Không tồn tại sản phẩm nào </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyerSearch
