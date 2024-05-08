import { RiBillLine } from 'react-icons/ri'
import { BsCashStack } from 'react-icons/bs'
import { LiaShippingFastSolid } from 'react-icons/lia'
import { FaPeopleCarryBox } from 'react-icons/fa6'
import { FaRegStar } from 'react-icons/fa'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { useQuery } from '@tanstack/react-query'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import { useNavigate, useParams } from 'react-router-dom'
import { ResponseItem } from '@/types/order.type'
import { formatPrice } from '@/utils/helpers'
import { IoIosArrowForward } from 'react-icons/io'

const BuyerOrderDetail = () => {
  const { id } = useParams()
  const axiosPrivate = useAxiosBuyerPrivate()
  const navigate = useNavigate()

  const { data: orderDetail, isLoading } = useQuery({
    queryKey: [Buyer_QueryKeys.ORDER_DETAIL],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`/buyer/order/${id}`)
      return resp.data.data
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div className="mx-4 my-2">
      <div className="border-b-2 pb-5 lg:text-lg text-sm">
        <div className="flex justify-between">
          <div className="font-bold capitalize">Thông tin chi tiết đơn hàng</div>
          <div className="text-gray-500 text-sm">ID: {orderDetail.id}</div>
        </div>
      </div>
      <div>
        <ul className="timeline timeline-vertical lg:timeline-horizontal">
          <li>
            <div className="timeline-start text-sm text-gray-500">{orderDetail.statusWithDates[0].date}</div>
            <div className="timeline-middle text-primary">
              <RiBillLine className="w-10 h-10" />
            </div>
            <div
              className={`timeline-end timeline-box ${
                orderDetail.statusWithDates[0].date !== ' ' ? 'text-green-500 font-bold' : ''
              }`}
            >
              Đơn hàng đã đặt
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle text-primary">
              <BsCashStack className="w-10 h-10" />
            </div>
            <div className={`timeline-end timeline-box ${orderDetail.paid ? 'text-green-500 font-bold' : ''}`}>
              <p>Đã thanh toán</p>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-start text-sm text-gray-500">{orderDetail.statusWithDates[1].date}</div>
            <div className="timeline-middle text-primary">
              <LiaShippingFastSolid className="w-10 h-10" />
            </div>
            <div
              className={`timeline-end timeline-box ${
                orderDetail.statusWithDates[1].date !== ' ' ? 'text-green-500 font-bold' : ''
              }`}
            >
              Chuẩn bị hàng
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-start text-sm text-gray-500">{orderDetail.statusWithDates[2].date}</div>
            <div className="timeline-middle text-primary">
              <FaPeopleCarryBox className="w-10 h-10" />
            </div>
            <div
              className={`timeline-end timeline-box ${
                orderDetail.statusWithDates[2].date !== ' ' ? 'text-green-500 font-bold' : ''
              }`}
            >
              Đang vận
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-start text-sm text-gray-500">{orderDetail.statusWithDates[3].date}</div>
            <div className="timeline-middle text-primary">
              <FaRegStar className="w-10 h-10" />
            </div>
            <div
              className={`timeline-end timeline-box ${
                orderDetail.statusWithDates[3].date !== ' ' ? 'text-green-500 font-bold' : ''
              }`}
            >
              Hoàn thành
            </div>
          </li>
        </ul>
      </div>
      <div className="divider divider-start divider-success text-sm">Chi tiết đơn hàng</div>
      <div>
        <div className="text-sm m-2 flex flex-col gap-3">
          <p className="text-lg">Địa chỉ nhận hàng</p>
          <p>Họ và tên người nhận: {orderDetail.deliveryAddress.receiverName}</p>
          <p>SDT người nhận: {orderDetail.deliveryAddress.receiverPhone}</p>
          <p>{orderDetail.deliveryAddress.deliveryAddress}</p>
        </div>
        <div className="m-2">
          <p className="text-lg">Danh sách sản phẩm</p>
          <div className="flex items-center justify-between p-2">
            <button onClick={() => navigate(`/shop/${orderDetail.storeInfo.id}`)}>
              <div className="flex gap-2 items-center">
                <img
                  src={orderDetail.storeInfo.logo}
                  alt={orderDetail.storeInfo.id}
                  className="w-10 h-10 object-cover rounded-full"
                />
                <p className="font-bold uppercase">{orderDetail.storeInfo.name}</p>
                <IoIosArrowForward />
              </div>
            </button>
          </div>
          {orderDetail.orderItemList.map((order: ResponseItem) => {
            return (
              <>
                <div className="card bg-base-100 shadow-sm mb-2 px-4">
                  <div className="my-2">
                    <div className="grid grid-cols-5 gap-2">
                      <button
                        onClick={() => navigate(`/product/${order.productId}`)}
                        className="flex items-center justify-center"
                      >
                        <figure>
                          <img src={order.productThumbnail} alt={order.productName} className="h-20 w-20" />
                        </figure>
                      </button>
                      <div className="col-span-4">
                        <h2 className="text-lg">{order.productName}</h2>
                        <div className="text-sm text-gray-500">
                          <p>Vật liệu: {order.productMaterial}</p>
                          <div className="flex justify-between">
                            <p>Số lượng: x{order.quantity}</p>
                            <div className="flex gap-2">
                              <span className=" text-gray-400">Giá: {formatPrice(order.productPrice)}</span>
                              <span className="text-primary">Tổng: {formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          })}
        </div>
        <div className="divider divider-start divider-info text-sm">Hoá đơn</div>
        <div>
          <div>
            <p>Tổng tiền hàng: {formatPrice(orderDetail.total)}</p>
            <p>Phí vận chuyển: {formatPrice(orderDetail.shippingFee)}</p>
            <p>Số tiền giảm: {formatPrice(orderDetail.voucherDiscount)}</p>
            <p className="text-primary text-xl font-bold">
              Thành tiền: {formatPrice(orderDetail.total + orderDetail.shippingFee - orderDetail.voucherDiscount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerOrderDetail
