/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderItem, ResponseItem } from '@/types/order.type'
import { formatPrice } from '@/utils/helpers'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowForward } from 'react-icons/io'
import { FaRegStar, FaStar } from 'react-icons/fa'
import { useState } from 'react'
import { toast } from 'react-toastify'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'

const OrderItemComponent = ({ order }: { order: OrderItem }) => {
  const axiosPrivate = useAxiosBuyerPrivate()
  const [isLoading, setIsLoading] = useState(false)
  const [rating, setRating] = useState(5)
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [productId, setProductId] = useState('')

  const handleReview = async () => {
    try {
      setIsLoading(true)
      if (content === '') {
        toast.error('Bạn chưa nhập nội dung đánh giá!')
        return
      }
      const review = {
        productId: productId,
        content: content,
        star: rating,
      }

      const resp = await axiosPrivate.post('/buyer/review', review)
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        setContent('')
        setRating(5)
        setProductId('')
        setIsLoading(false)
      }
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.response.data.messages[0])
    }
  }

  return (
    <>
      <div className="grid card mb-10 lg:text-base text-sm bg-slate-100 px-4">
        <div className="flex items-center justify-between p-2">
          <button onClick={() => navigate(`/shop/${order.storeInfo.id}`)}>
            <div className="flex gap-2 items-center">
              <img
                src={order.storeInfo.logo}
                alt={order.storeInfo.id}
                className="w-10 h-10 object-cover rounded-full"
              />
              <p className="font-bold uppercase">{order.storeInfo.name}</p>
              <IoIosArrowForward />
            </div>
          </button>
          <div className="flex gap-2">
            <button onClick={() => navigate(`order/${order.id}`)} className="btn btn-sm btn-outline">
              Xem chi tiết
            </button>
            {order.status !== 'COMPLETED' && <button className="btn btn-sm btn-outline">Hủy đơn</button>}
          </div>
        </div>
        {order.responses.map((response: ResponseItem) => {
          return (
            <>
              <div className="card bg-base-100 shadow-sm mb-2 px-4">
                <div className="my-2">
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => navigate(`/product/${response.productId}`)}
                      className="flex items-center justify-center"
                    >
                      <figure>
                        <img src={response.productThumbnail} alt={response.productName} className="h-20 w-20" />
                      </figure>
                    </button>
                    <div className="col-span-4">
                      <h2 className="text-lg">{response.productName}</h2>
                      <div className="text-sm text-gray-500">
                        <p>Vật liệu: {response.productMaterial}</p>
                        <div className="flex justify-between">
                          <p>Số lượng: x{response.quantity}</p>
                          <div className="flex gap-2">
                            <span className=" text-gray-400">Giá: {formatPrice(response.productPrice)}</span>
                            <span className="text-primary">Tổng: {formatPrice(response.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div></div>
                    <div className="flex items-center justify-end ">
                      <button
                        onClick={() => {
                          setProductId(response.productId)
                          const dialog = document.getElementById('my_modal_5') as HTMLDialogElement
                          dialog.showModal()
                        }}
                        className="btn btn-sm btn-primary text-white"
                      >
                        Đánh giá
                      </button>
                      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                          <h3 className="font-bold text-lg capitalize">Đánh giá sản phẩm</h3>
                          <div className="grid grid-cols-5 gap-2 items-center my-2">
                            <figure>
                              <img src={response.productThumbnail} alt={response.productName} className="h-20 w-20" />
                            </figure>
                            <div className="col-span-4">
                              <h2 className="text-lg">{response.productName}</h2>
                              <div className="text-sm text-gray-500">
                                <div className="flex justify-between">
                                  <div className="flex gap-2">
                                    <span className=" text-gray-400">Vật liệu: {response.productMaterial}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder="Nhập đánh giá của bạn"
                            onChange={(e) => setContent(e.target.value)}
                            className="input input-bordered input-success w-full my-2"
                          />
                          <p>Chất lượng sản phẩm</p>
                          <div className="flex gap-2 my-2 items-center">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <span key={index} onClick={() => setRating(index + 1)}>
                                {index < rating ? (
                                  <FaStar className="lg:w-8 lg:h-8 w-4 h-4 text-amber-500" />
                                ) : (
                                  <FaRegStar className="lg:w-8 lg:h-8 w-4 h-4 text-amber-500" />
                                )}
                              </span>
                            ))}
                            <span className="ml-2">
                              {rating === 1 && ' Tệ'}
                              {rating === 2 && ' Không hài lòng'}
                              {rating === 3 && ' Bình thường'}
                              {rating === 4 && ' Hài lòng'}
                              {rating === 5 && ' Tuyệt vời'}
                            </span>
                          </div>
                          <div className="modal-action">
                            <button onClick={() => handleReview()} className="btn btn-primary text-white">
                              {isLoading ? 'Đang gửi' : 'Gửi đánh giá'}
                            </button>
                            <button
                              onClick={() => {
                                const dialog = document.getElementById('my_modal_5') as HTMLDialogElement
                                dialog.close()
                              }}
                              className="btn"
                            >
                              Đóng
                            </button>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        })}
      </div>
      <div className="divider"></div>
    </>
  )
}

export default OrderItemComponent
