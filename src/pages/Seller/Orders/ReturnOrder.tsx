/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadingComponent } from '@/components'
import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useImagePreview from '@/hooks/useImagePreview'
import { RefundOrderType } from '@/types/order.type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

type FormData = {
  reason: string
  images?: FileList | string | null
}

const ReturnOrder = () => {
  const axiosPrivate = useAxiosPrivate()
  const { previewImages: images, handleFileChange: handleImagesChange } = useImagePreview()
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [isAccepted, setIsAccepted] = useState(false)
  const client = useQueryClient()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Fnest Seller - Đơn hoàn trả'
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: [Seller_QueryKeys.REFUND_ORDER_LIST, isAccepted],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`/seller/order-refund/by-accepted?accepted=${isAccepted}`)
      return resp.data.data
    },
  })

  const handleAcceptedRefund = async () => {
    try {
      const resp = await axiosPrivate.put(`/seller/order-refund/accepted/${selectedOrderId}`)
      if (resp.status === 200) {
        closeModal()
        toast.success(resp.data.messages[0])
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
      closeModal()
    }
  }

  const columns: TableColumn<RefundOrderType>[] = [
    { name: 'ID', cell: (row) => row.id },
    { name: 'Lý do', cell: (row) => row.reason },
    {
      name: 'Hình ảnh',
      cell: (row) => (
        <div className="grid grid-cols-3 gap-2 my-2">
          {row.images.map((image) => (
            <img key={image} src={image} className="w-20 h-20" />
          ))}
        </div>
      ),
    },
    { name: 'Thời gian', selector: (row) => row.createdAt },
    {
      name: 'Action',
      cell: (row) => (
        <div className="flex gap-2">
          {!row.accepted && (
            <>
              <button
                onClick={() => {
                  setSelectedOrderId(row.id)
                  const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
                  dialog.showModal()
                }}
                className="link"
              >
                Đồng ý hoàn trả
              </button>
              <button
                onClick={() => {
                  setSelectedOrderId(row.id)
                  const dialog = document.getElementById('my_modal_5') as HTMLDialogElement
                  dialog.showModal()
                }}
                className="link"
              >
                Gửi khiếu nại
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

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
        orderRefundId: selectedOrderId,
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

      const resp = await axiosPrivate.post('/seller/refund-complaint', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (resp.status === 200) {
        const dialog = document.getElementById('my_modal_5') as HTMLDialogElement
        dialog.close()
        toast.success(resp.data.messages[0])
        reset()
        client.invalidateQueries({ queryKey: [Seller_QueryKeys.REFUND_ORDER_LIST, isAccepted] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const closeModal = () => {
    const dialog = document.getElementById('my_modal_5') as HTMLDialogElement
    dialog.close()
  }

  return (
    <section className="mx-4 my-2 text-sm">
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Gửi khiếu nại hoàn trả đơn hàng không hợp lệ</h3>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="w-full">
              <p className="text-sm py-2">Giải trình lý do</p>
              <textarea
                className="textarea textarea-primary w-full"
                placeholder="Viết lý do hoàn trả đơn hàng này"
                {...register('reason')}
              ></textarea>
              {errors.reason?.message && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
              <div className="col-span-2">
                <label className="label" htmlFor="logo">
                  <span className="label-text capitalize text-sm">Hình ảnh minh chứng(*)</span>
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
                  const diaglog = document.getElementById('my_modal_5') as HTMLDialogElement
                  diaglog.close()
                  reset()
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <dialog id="my_modal_1" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận hoàn trả đơn hàng?</h3>

          <p>Bạn chắc chắn muốn đồng ý hoàn trả đơn hàng này cho khách hàng?</p>
          <div className="modal-action">
            <button className="btn btn-primary text-white" onClick={handleAcceptedRefund}>
              Gửi
            </button>
            <button
              className="btn"
              onClick={() => {
                const diaglog = document.getElementById('my_modal_1') as HTMLDialogElement
                diaglog.close()
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      </dialog>
      <div className="card shadow-lg m-2 bg-white">
        <div className="m-4">
          <DataTable
            title={
              <div className="md:flex justify-between">
                <p className="md:text-xl text-base">DANH SÁCH TẤT CẢ ĐƠN HÀNG ĐƯỢC YÊU CẦU HOÀN TRẢ</p>
                <button className="btn btn-primary btn-sm text-white" onClick={() => setIsAccepted(!isAccepted)}>
                  {isAccepted ? 'Trạng thái: Đã xác nhận' : 'Trạng thái: Chưa xác nhận'}
                </button>
              </div>
            }
            columns={columns}
            data={data}
            progressPending={isLoading}
            progressComponent={<LoadingComponent />}
            highlightOnHover
            pagination
          />
          ;
        </div>
      </div>
    </section>
  )
}

export default ReturnOrder
