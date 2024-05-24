/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderItem, ResponseItem } from '@/types/order.type'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowForward } from 'react-icons/io'
import { toast } from 'react-toastify'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { useQueryClient } from '@tanstack/react-query'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import { formatPrice } from '@/utils/helpers'

const OrderItemComponent = ({ order }: { order: OrderItem }) => {
  const axiosPrivate = useAxiosBuyerPrivate()
  const navigate = useNavigate()
  const client = useQueryClient()

  const handleCancelOrder = async () => {
    try {
      const resp = await axiosPrivate.patch(`/buyer/order/${order.id}`)
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        client.invalidateQueries({ queryKey: [Buyer_QueryKeys.ORDER_LIST] })
      }
    } catch (error: any) {
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
              <p className="font-bold uppercase md:text-base text-sm">{order.storeInfo.name}</p>
              <IoIosArrowForward />
            </div>
          </button>
          <div className="flex gap-2 items-center">
            <button onClick={() => navigate(`order/${order.id}`)} className="btn btn-sm btn-outline">
              Xem chi tiết
            </button>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg text-center">Bạn chắc chắn muốn hủy đơn hàng này?</h3>
                <div className="modal-action">
                  <form method="dialog">
                    <div className="flex justify-center items-center gap-2">
                      <button onClick={handleCancelOrder} className="btn btn-primary text-white">
                        Xác nhận
                      </button>
                      <button className="btn">Hủy</button>
                    </div>
                  </form>
                </div>
              </div>
            </dialog>
            {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
              <button
                onClick={() => {
                  const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
                  dialog.showModal()
                }}
                className="btn btn-sm btn-outline"
              >
                Hủy đơn
              </button>
            )}
            {order.status === 'CANCELLED' && <p className="badge badge-error text-white p-4 ">Đơn đã hủy</p>}
          </div>
        </div>
        {order.responses.map((response: ResponseItem) => {
          return (
            <div className="card bg-base-100 shadow-sm mb-2 px-4" key={response.productId}>
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
                        navigate(`review-product/${response.productId}`)
                      }}
                      className="btn btn-sm btn-primary text-white"
                    >
                      Đánh giá
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="divider"></div>
    </>
  )
}

export default OrderItemComponent
