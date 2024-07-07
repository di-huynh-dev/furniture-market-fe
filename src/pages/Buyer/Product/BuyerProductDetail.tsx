/* eslint-disable @typescript-eslint/no-explicit-any */
import { Seller_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { formatDate, formatPrice } from '@/utils/helpers'
import { ReviewType } from '@/types/review.type'
import { useDispatch } from 'react-redux'
import { addToCart, getTotals } from '@/redux/reducers/buyer/cartSlice'
import { CiWarning } from 'react-icons/ci'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/redux/reducers/authSlice'
import { toast } from 'react-toastify'
import { LoadingComponent } from '@/components'
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookMessengerShareButton,
  EmailShareButton,
  LinkedinShareButton,
  EmailIcon,
  LinkedinIcon,
  FacebookIcon,
  FacebookMessengerIcon,
} from 'react-share'

const BuyerProductDetail = () => {
  const { id } = useParams()
  const axiosPrivate = useAxiosBuyerPrivate()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [reviews, setReviews] = useState([])
  const [reportReason, setReportReason] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const user = useSelector(selectAuth)

  const url = import.meta.env.VITE_PUBLIC_WEBSITE_URL
  const shareLink = `${url}/product/${id}`

  const dispatch = useDispatch()

  useEffect(() => {
    scrollTo(0, 0)
    document.title = 'Fnest - Chi tiết sản phẩm'
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

  const handleReportProduct = async () => {
    try {
      if (!user.authData.accessToken) {
        navigate('/buyer/login')
        return
      }
      if (!reportReason || !reportDescription) {
        toast.error('Vui lòng điền đầy đủ thông tin')
        return
      }
      const resp = await axiosPrivate.post(`/user/report`, {
        reason: reportReason,
        description: reportDescription,
        type: 'PRODUCT_REPORT',
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
    return <LoadingComponent />
  }

  return (
    <>
      <div className="grid lg:grid-cols-2 grid-col-1 gap-10 align-element bg-white p-5 mt-5 rounded-lg">
        <dialog className="modal" id="my_modal_3">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Báo cáo sản phẩm vi phạm!</h3>
            <select className="select select-primary w-full my-2" onChange={(e) => setReportReason(e.target.value)}>
              <option disabled selected>
                Chọn lý do
              </option>
              <option value="Sản phẩm bị cấm buôn bán">Sản phẩm bị cấm buôn bán(động vật hoang dã, 18+,...)</option>
              <option value="Sản phẩm có dấu hiệu lừa đảo">Sản phẩm có dấu hiệu lừa đảo</option>
              <option value="Hàng nhái, hàng giả, không đúng mô tả">Hàng nhái, hàng giả, không đúng mô tả</option>
              <option value="Sản phẩm không rõ nguồn gốc, xuất xứ">Sản phẩm không rõ nguồn gốc, xuất xứ</option>
              <option value="Sản phẩm có nội dung, hình ảnh phản cảm">Sản phẩm có nội dung, hình ảnh phản cảm</option>
              <option value="Tên sản phẩm không phù hợp với hình ảnh">Tên sản phẩm không phù hợp với hình ảnh</option>
            </select>
            <textarea
              placeholder="Mô tả báo cáo (10-150 kí tự)"
              className="textarea textarea-bordered textarea-primary w-full mt-2 resize-vertical"
              rows={3}
              maxLength={150}
              onChange={(e) => setReportDescription(e.target.value)}
            ></textarea>
            <div className="modal-action flex">
              <button className="btn btn-primary text-white" onClick={handleReportProduct}>
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

          <div className="flex items-center gap-x-2 justify-center w-full mt-10">
            <p>Chia sẻ:</p>
            <FacebookShareButton url={shareLink} title={product_detail.name}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <FacebookMessengerShareButton appId="" url={shareLink} title={product_detail.name}>
              <FacebookMessengerIcon size={32} round />
            </FacebookMessengerShareButton>
            <TwitterShareButton url={shareLink} title={product_detail.name}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={shareLink} title={product_detail.name}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <EmailShareButton url={shareLink} subject={product_detail.name}>
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <h2 className="lg:text-4xl md:text-2xl text-base font-bold">{product_detail.name}</h2>
            <button
              onClick={() => {
                const dialog = document.getElementById('my_modal_3') as HTMLDialogElement
                dialog.showModal()
              }}
            >
              <CiWarning className="w-[30px] h-[30px] text-primary transition-colors duration-300" />
              Tố cáo
            </button>
          </div>
          <div className="flex justify-between p-2 lg:text-base text-sm">
            <div className="flex items-center">
              {product_detail.reviewAmount &&
                (product_detail.totalReviewPoint / product_detail.reviewAmount).toFixed(1)}
              <FaStar className="text-yellow-500" />/ ({product_detail.reviewAmount} đánh giá)
            </div>

            <span>
              <b>Đã bán: </b>
              {product_detail.sold}
            </span>
          </div>
          {product_detail.onSale ? (
            <div className="lg:text-lg text-base">
              <span className="text-primary font-bold pr-4">{formatPrice(product_detail.salePrice)}</span>
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
                <b>Danh mục shop: </b>
                {product_detail.storeCategories.map((category: string) => category).join(', ')}
              </p>
            )}
            {product_detail.categoryName && (
              <p className="py-2">
                <b>Danh mục sàn: </b>
                {product_detail.categoryName}
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
              <div className="text-primary flex gap-2 items-center">
                <p>
                  {product_detail.storeInfo.avgReviewStar !== 'NaN'
                    ? product_detail.storeInfo.avgReviewStar.toFixed(1)
                    : '...'}
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
                ? (product_detail.totalReviewPoint / product_detail.reviewAmount).toFixed(1)
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
                      <img src={review.reviewer?.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                    </div>
                    <div className="col-span-7">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-bold">{review.reviewer?.fullName}</p>
                          <div className="flex items-center">
                            <p>{review.star}</p> <FaStar className="text-yellow-500" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 italic">{formatDate(review.createdAt)}</p>
                      </div>
                      <p className="mt-2">{review.content}</p>
                      {review.reply && (
                        <div className="bg-gray-100 p-2 my-2">
                          <p>Phản hồi của người bán</p>
                          <p>{review.reply}</p>
                        </div>
                      )}
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
