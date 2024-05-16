/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadingComponent } from '@/components'
import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { FeedbackType } from '@/types/review.type'
import { formatDate } from '@/utils/helpers'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { toast } from 'react-toastify'

const Feedback = () => {
  const axiosPrivate = useAxiosPrivate()
  const [status, setStatus] = useState('FALSE')
  const [selectedFeedback, setSelectedFeedback] = useState('')
  const [content, setContent] = useState('')
  const client = useQueryClient()

  const { data: feedbacks, isLoading } = useQuery({
    queryKey: [Seller_QueryKeys.FEEDBACK_LIST],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get(`/seller/store/review-by-reply?isReply=${status}&currentPage=0&pageSize=12`)
        if (resp.status === 200) {
          return resp.data.data.content
        }
      } catch (error: any) {
        toast.error(error.response.data.messages[0])
      }
    },
  })

  console.log(feedbacks)

  const handleReplyFeedback = async () => {
    try {
      if (!content) {
        toast.error('Vui lòng nhập nội dung phản hồi!')
        return
      }
      const resp = await axiosPrivate.put(`/seller/store/review-reply`, {
        reviewId: selectedFeedback,
        replyContent: content,
      })
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        setContent('')
        client.invalidateQueries({ queryKey: [Seller_QueryKeys.FEEDBACK_LIST] })
        const dialog = document.getElementById('my_modal_2') as HTMLDialogElement
        dialog.close()
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  if (isLoading) return <LoadingComponent />

  const columns: TableColumn<FeedbackType>[] = [
    {
      name: 'Thông Tin Sản phẩm',
      selector: (row) => row.productInfo.name,
    },
    { name: 'Nội dung đánh giá', selector: (row) => row.content },
    { name: 'Điểm', selector: (row) => row.star },

    { name: 'Người đánh giá', cell: (row) => row.reviewer.email },
    { name: 'Ngày đánh giá', selector: (row) => formatDate(row.createdAt) },
    { name: 'Trạng thái', cell: (row) => (row.reply ? <p>Đã phản hồi</p> : <p>Chưa phản hồi</p>) },
    {
      name: 'Thao tác',
      cell: (row) => (
        <div>
          {!row.reply && (
            <button
              onClick={() => {
                setSelectedFeedback(row.id)
                const dialog = document.getElementById('my_modal_2') as HTMLDialogElement
                dialog.showModal()
              }}
              className="link text-primary"
            >
              Phản hồi{' '}
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <section className="mx-4 my-2 text-sm">
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Phản hồi đánh giá</h3>
          <p className="py-4">Nội dung phản hồi</p>
          <input type="text" onChange={(e) => setContent(e.target.value)} className="input input-bordered w-full" />
          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-2">
                <button className="btn btn-primary text-white" onClick={handleReplyFeedback}>
                  Gửi
                </button>
                <button className="btn">Close</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="pb-5 lg:text-lg text-sm">
            <div className="grid md:grid-cols-2">
              <div>
                <div className="font-bold capitalize">Quản lý Đánh giá của người dùng</div>
                <div className="text-gray-500 text-sm">Thông tin về số dư của bạn, nạp rút tiền trên tài khoản</div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <p>Trạng thái:</p>
            <button
              className={`btn btn-sm ${status === 'FALSE' ? 'btn-primary text-white' : 'btn-outline'}`}
              onClick={() => {
                setStatus('FALSE')
                client.invalidateQueries({
                  queryKey: [Seller_QueryKeys.FEEDBACK_LIST],
                })
              }}
            >
              Chưa phản hồi
            </button>
            <button
              className={`btn btn-sm ${status === 'TRUE' ? 'btn-primary text-white' : 'btn-outline'}`}
              onClick={() => {
                setStatus('TRUE')
                client.invalidateQueries({
                  queryKey: [Seller_QueryKeys.FEEDBACK_LIST],
                })
              }}
            >
              Đã phản hồi
            </button>
          </div>

          <div className="m-4">
            <DataTable columns={columns} data={feedbacks} pagination />;
          </div>
        </div>
      </div>
    </section>
  )
}

export default Feedback
