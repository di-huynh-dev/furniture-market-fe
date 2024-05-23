/* eslint-disable @typescript-eslint/no-explicit-any */
import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Notification } from '@/types/notify.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import Notify from '@/pages/Buyer/Profile/components/Notify'

const NotifyManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const [dataNotifications, setDataNotifications] = useState<Notification[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(5)
  const [totalPages, setTotalPages] = useState<number>(0)

  const getNotificationMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.get(
        `/user/announce?type=ACCOUNT&currentPage=${currentPage}&pageSize=${pageSize}`,
      )
      return response
    },
    onSuccess: (response) => {
      const data = response.data.data || {}
      setPageSize(data.pageSize)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
      setDataNotifications(data.content || [])
    },
    onError: (error: any) => {
      toast.error(error.response.data.messages[0])
    },
  })

  useEffect(() => {
    getNotificationMutation.mutate()
  }, [currentPage, pageSize])

  const handleMarkAllAsRead = async () => {
    try {
      const resp = await axiosPrivate.patch('/user/announce/mark-as-read')
      if (resp.status === 200) {
        queryClient.invalidateQueries({ queryKey: [Seller_QueryKeys.USER_NOTIFICATION] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  return (
    <section className="mx-4 my-2 text-sm">
      <div className="card shadow-lg bg-white">
        <div className="card-body">
          <div className="border-b-2 pb-5 lg:text-lg text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold capitalize">Thông báo tài khoản của tôi</div>
                <button className="btn btn-sm" onClick={handleMarkAllAsRead}>
                  Đánh dấu tất cả đã đọc
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <div className="text-sm">
                  Trang {currentPage + 1}/{totalPages}
                </div>
                <div className="join">
                  {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                    <button
                      onClick={() => setCurrentPage(page)}
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
          </div>
          {/* {!data.content && <p className="text-xl">Không có thông báo nào</p>} */}
          {dataNotifications &&
            dataNotifications.map((item: Notification) => (
              <div key={item.id}>
                <Notify
                  title={'Hệ thống'}
                  content={item.content[1]}
                  time={item.createdAt}
                  navigation={item.content[0]}
                />
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default NotifyManagement
