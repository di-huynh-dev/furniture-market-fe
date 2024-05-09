import { Seller_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AiOutlineHeart } from 'react-icons/ai'
import { FaStar } from 'react-icons/fa'
import { formatDate, formatPrice } from '@/utils/helpers'
import { ReviewType } from '@/types/review.type'
import { useDispatch } from 'react-redux'
import { addToCart, getTotals } from '@/redux/reducers/buyer/cartSlice'

const BuyerProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [reviews, setReviews] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    scrollTo(0, 0)
    getReviewByStarsMutation.mutate(0)
  }, [])

  const { data: product_detail, isLoading } = useQuery({
    queryKey: [Seller_QueryKeys.PRODUCT_DETAIL],
    queryFn: async () => {
      const resp = await axiosClient.get(`/product/${id}`)
      setSelectedImage(resp.data.data.images[0])
      return resp.data.data
    },
    enabled: !!id,
  })

  const getReviewByStarsMutation = useMutation({
    mutationFn: async (tabName: number) => {
      if (tabName === 0) {
        const resp = await axiosClient.get(`/review/search?product.equals=id,${id}`)
        return resp
      } else {
        const resp = await axiosClient.get(`/review/search?product.equals=id,${id}&star.equals=${tabName}`)
        return resp
      }
    },
    onSuccess: (resp) => {
      setReviews(resp.data.data.content)
    },
  })
  const handleTabClick = (tabName: number) => {
    setActiveTab(tabName)
    getReviewByStarsMutation.mutate(tabName)
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setSelectedImageIndex(imageUrl)
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product_detail))
    dispatch(getTotals())
  }

  const handleAddToWishList = () => {}

  if (isLoading) {
    return <div>Loading...</div>
  }

  // Calculate the average rating
  const averageRating: number | string = product_detail.totalReviewPoint / product_detail.reviewAmount

  return (
    <>
      <div className="grid lg:grid-cols-2 grid-col-1 gap-10 align-element bg-white p-5 mt-5 rounded-lg">
        <div>
          <img src={selectedImage} className="border-solid border-2 rounded-xl" />
          <div className="grid md:grid-cols-6 grid-cols-4 gap-1 mt-2 ">
            {product_detail.images.map((url: string) => {
              return (
                <img
                  key={url}
                  src={url}
                  alt={product_detail.name}
                  className={`rounded-xl object-fit h-[75px] border-solid border-2 ${
                    selectedImageIndex === url ? 'border-info' : 'border-gray-300'
                  }`}
                  onClick={() => handleImageClick(url)}
                />
              )
            })}
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <h2 className="lg:text-4xl md:text-2xl text-base font-bold">{product_detail.name}</h2>
            <AiOutlineHeart className="w-[30px] h-[30px] text-primary transition-colors duration-300" />
          </div>
          <div className="flex justify-between p-2 lg:text-base text-sm">
            <div className="flex items-center">
              ({averageRating ? averageRating.toFixed(1) : ''} <FaStar className="text-yellow-500" />/{' '}
              {product_detail.reviewAmount} đánh giá)
            </div>

            <span>
              <b>Đã bán: </b>
              {product_detail.sold}
            </span>
          </div>
          {product_detail.onSale ? (
            <div className="lg:text-lg text-base">
              <span className="text-primary font-bold pr-4">{formatPrice(product_detail.salePrice)}</span>
              <span className="line-through">{formatPrice(product_detail.price)}</span>
            </div>
          ) : (
            <div className="lg:text-lg text-base">
              <span className="text-primary text-2xl font-bold pr-4">{formatPrice(product_detail.price)}</span>
            </div>
          )}
          <div className="lg:text-base text-sm">
            <div className="pb-2 border-b-2">
              <span className="text-sm tex-base-300">SKU: {product_detail.id}</span>
            </div>
            <p className="py-2">
              <b>Chất liệu: </b>
              {product_detail.material}
            </p>
            <p className="py-2">
              <b>Kích thước: </b>
              {product_detail.length}cm dài x {product_detail.width}cm rộng x {product_detail.height}cm cao
            </p>
            <p className="py-2">
              <b>Số lượng còn lại: </b>
              {product_detail.inStock}
            </p>
            {product_detail.storeCategories[0] && (
              <p className="py-2">
                <b>Danh mục: </b>
                {product_detail.storeCategories.map((category: string) => category).join(', ')}
              </p>
            )}
            <p className="py-2 leading-loose">
              <b>Mô tả: </b>
              {product_detail.description}
            </p>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
            <button className="btn btn-ghost bg-primary text-white" onClick={() => handleAddToCart()}>
              Thêm vào giỏ hàng
            </button>
            <button className="btn btn-ghost bg-accent text-white" onClick={() => handleAddToWishList()}>
              Thêm vào wishlist
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 align-element ">
        {/* Shop info */}
        <div className="my-5 bg-white  p-10  gap-4 max-h-[300px] rounded-lg">
          <div className="flex items-center gap-2">
            <img src={product_detail.storeInfo.logo} alt="" className="rounded-full w-40 h-40 object-cover" />
            <div className="space-y-2">
              <p className="text-lg font-bold">{product_detail.storeInfo.shopName}</p>
              <p className="text-sm text-gray-500">{product_detail.storeInfo.address}</p>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-sm btn-primary text-white"
                  onClick={() => navigate(`/shop/${product_detail.storeInfo.id}`)}
                >
                  Xem shop
                </button>
                <button className="btn btn-sm btn-outline">Chat</button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3">
            <div className="flex gap-2">
              <p>Tổng số sản phẩm: </p>
              <p className="text-primary">{product_detail.storeInfo.productAmount}</p>
            </div>
            <div className="flex gap-2">
              <p>Số lượng đánh giá: </p>
              <p className="text-primary">{product_detail.storeInfo.numReview}</p>
            </div>

            <div className="flex gap-2">
              <p>Điểm đánh giá: </p>
              <div className="text-primary flex gap-2">
                <p>
                  {product_detail.storeInfo.avgReviewStar !== 'NaN' ? product_detail.storeInfo.avgReviewStar : '...'}
                </p>{' '}
                <FaStar className="text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="my-5 bg-white p-10 gap-4 rounded-lg">
          <p className="font-semibold">Đánh giá nhận xét về sản phẩm ( {product_detail.reviewAmount} lượt đánh giá )</p>
          <div className="flex items-center">
            <p className="text-4xl font-bold">
              {product_detail.totalReviewPoint && product_detail.reviewAmount !== 'NaN'
                ? product_detail.totalReviewPoint / product_detail.reviewAmount
                : '...'}
              /
            </p>
            <p className="text-3xl text-red-500">5</p>
          </div>
          <p className="italic text-sm">
            Đây là thông tin người mua đánh giá shop bán sản phẩm này có đúng mô tả không.
          </p>

          <div className="my-2">
            <div role="tablist" className="tabs tabs-bordered">
              <button
                onClick={() => handleTabClick(0)}
                role="tab"
                className={`tab ${activeTab === 0 ? 'tab-active' : ''}`}
              >
                Tất cả
              </button>
              <button
                onClick={() => handleTabClick(1)}
                role="tab"
                className={`tab ${activeTab === 1 ? 'tab-active' : ''}`}
              >
                1 sao
              </button>
              <button
                onClick={() => handleTabClick(2)}
                role="tab"
                className={`tab ${activeTab === 2 ? 'tab-active' : ''}`}
              >
                2 sao
              </button>
              <button
                onClick={() => handleTabClick(3)}
                role="tab"
                className={`tab ${activeTab === 3 ? 'tab-active' : ''}`}
              >
                3 sao
              </button>
              <button
                onClick={() => handleTabClick(4)}
                role="tab"
                className={`tab ${activeTab === 4 ? 'tab-active' : ''}`}
              >
                4 sao
              </button>
              <button
                onClick={() => handleTabClick(5)}
                role="tab"
                className={`tab ${activeTab === 5 ? 'tab-active' : ''}`}
              >
                5 sao
              </button>
            </div>

            <div className="my-2">
              {reviews.length === 0 && <p className="text-center text-error">Chưa có đánh giá nào liên quan</p>}
              {reviews?.map((review: ReviewType) => (
                <>
                  <div className="grid grid-cols-8 my-2">
                    <div className="col-span-1">
                      <img
                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="col-span-7">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-bold">Huỳnh Tiến Dĩ</p>
                          <div className="flex items-center">
                            <p>{review.star}</p> <FaStar className="text-yellow-500" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 italic">{formatDate(review.createdAt)}</p>
                      </div>
                      <p className="mt-2">{review.content}</p>
                    </div>
                  </div>
                  <div className="divider"></div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BuyerProductDetail
