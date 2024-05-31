/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderItem, ResponseItem } from '@/types/order.type'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowForward } from 'react-icons/io'
import { toast } from 'react-toastify'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { useQueryClient } from '@tanstack/react-query'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import { formatPrice } from '@/utils/helpers'
import useImagePreview from '@/hooks/useImagePreview'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

type FormData = {
  reason: string
  images?: FileList | string | null
}

const OrderItemComponent = ({ order }: { order: OrderItem }) => {
  const axiosPrivate = useAxiosBuyerPrivate()
  const navigate = useNavigate()
  const client = useQueryClient()
  const { previewImages: images, handleFileChange: handleImagesChange } = useImagePreview()

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

  const schema = yup.object({
    reason: yup.string().required('Vui lý nhập lý do hoàn trả đơn'),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const handleSubmitForm = async (data: FormData) => {
    try {
      const formData = new FormData()
      const info = {
        reason: data.reason,
        orderId: order.id,
      }
      const json = JSON.stringify(info)
      const blob = new Blob([json], {
        type: 'application/json',
      })
      formData.append('info', blob)
      if (data.images instanceof FileList) {
        for (let i = 0; i < data.images.length; i++) {
          formData.append('images', data.images[i])
        }
      } else {
        toast.error('Vui lòng tải lên ít nhất một hình ảnh')
        return
      }

      const resp = await axiosPrivate.post('/buyer/order-refund', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (resp.status === 200) {
        closeDialog()
        toast.success(resp.data.messages[0])
        reset()
        client.invalidateQueries({ queryKey: [Buyer_QueryKeys.ORDER_LIST] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const closeDialog = () => {
    const dialog = document.getElementById('my_modal_5') as HTMLDialogElement
    dialog.close()
  }

  return (
    <>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Yêu cầu hoàn trả đơn</h3>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="w-full">
              <p className="text-sm py-2">Lý do hoàn trả</p>
              <textarea
                className="textarea textarea-primary w-full"
                placeholder="Viết lý do hoàn trả đơn hàng này"
                {...register('reason')}
              ></textarea>
              {errors.reason?.message && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
              <div className="col-span-2">
                <label className="label" htmlFor="logo">
                  <span className="label-text capitalize text-sm">Hình ảnh sản phẩm(*)</span>
                </label>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered file-input-xs w-full max-w-xs"
                  {...register('images')}
                  onChange={handleImagesChange}
                  multiple
                />
                {errors.images?.message && <p className="text-red-500 text-sm">{errors.images.message}</p>}
                <div className="lg:grid lg:grid-cols-3 md:grid-cols-2 gap-2">
                  {images &&
                    images.map((image, index) => (
                      <div key={`back-${index}`} className="mt-2 flex">
                        <img src={image} alt={`Back Preview ${index}`} className="w-80 h-60 object-contain" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-primary text-white" type="submit">
                Gửi
              </button>
              <button
                className="btn"
                type="reset"
                onClick={() => {
                  closeDialog()
                  reset()
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </dialog>
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
            <div className="flex items-center gap-2">
              {order.status === 'COMPLETED' && (
                <button
                  onClick={() => {
                    const dialog = document.getElementById('my_modal_5') as HTMLDialogElement
                    dialog.showModal()
                  }}
                  className="btn btn-sm btn-outline"
                >
                  Yêu cầu hoàn trả
                </button>
              )}
              <button onClick={() => navigate(`order/${order.id}`)} className="btn btn-sm btn-outline">
                Xem chi tiết
              </button>
            </div>
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
                  {order.status === 'COMPLETED' && (
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
                  )}
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
