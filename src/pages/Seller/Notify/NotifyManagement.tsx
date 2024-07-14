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
  const [accountNotifications, setAccountNotifications] = useState<Notification[]>([])
  const [reportNotifications, setReportNotifications] = useState<Notification[]>([])
  const [currentTab, setCurrentTab] = useState<'ACCOUNT' | 'REPORT'>('ACCOUNT')
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(5)
  const [totalPages, setTotalPages] = useState<number>(0)

  useEffect(() => {
    document.title = 'Fnest Seller - Thông báo'
    window.scrollTo(0, 0)
  }, [])

  const fetchNotifications = async (type: 'ACCOUNT' | 'REPORT') => {
    const response = await axiosPrivate.get(
      `/user/announce?type=${type}&currentPage=${currentPage}&pageSize=${pageSize}`,
    )
    return response.data.data
  }

  const getNotificationMutation = useMutation({
    mutationFn: async () => {
      const [accountData, reportData] = await Promise.all([fetchNotifications('ACCOUNT'), fetchNotifications('REPORT')])
      return { accountData, reportData }
    },
    onSuccess: ({ accountData, reportData }) => {
      setPageSize(accountData.pageSize) // Assuming pageSize is the same for both types
      setCurrentPage(accountData.currentPage)
      setTotalPages(accountData.totalPages) // Assuming totalPages is the same for both types
      setAccountNotifications(accountData.content || [])
      setReportNotifications(reportData.content || [])
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

  const currentNotifications = currentTab === 'ACCOUNT' ? accountNotifications : reportNotifications

  return (
    <section className="mx-4 my-2 text-sm">
      <div className="card shadow-lg bg-white">
        <div className="card-body">
          <div className=" lg:text-lg text-sm">
            <div className="md:flex items-center justify-between">
              <div>
                <div className="font-bold capitalize">Thông báo tài khoản của tôi</div>
                <button
                  className="btn btn-outline my-2 text-primary  hover:text-white hover:bg-primary hover:border-primary btn-sm"
                  onClick={handleMarkAllAsRead}
                >
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
          <div role="tablist" className="tabs tabs-lifted ">
            <button
              className={`tab ${
                currentTab === 'ACCOUNT' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
              }`}
              onClick={() => setCurrentTab('ACCOUNT')}
            >
              Tài khoản
            </button>
            <button
              className={`tab ${
                currentTab === 'REPORT' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
              }`}
              onClick={() => setCurrentTab('REPORT')}
            >
              Giải quyết khiếu nại
            </button>
          </div>
          {currentNotifications.length === 0 ? (
            <p className="text-center">Không có thông báo nào</p>
          ) : (
            currentNotifications.map((item: Notification) => (
              <div key={item.id}>
                <Notify
                  title={'Hệ thống'}
                  content={item.content[1]}
                  time={item.createdAt}
                  navigation={item.content[0]}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default NotifyManagement
