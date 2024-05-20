/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadingComponent } from '@/components'
import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Notification } from '@/types/notify.type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import image from '@/assets/images/account-setting.jpg'
import { toast } from 'react-toastify'

const NotifyManagement = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const { data: notifications, isLoading } = useQuery({
    queryKey: [Seller_QueryKeys.USER_NOTIFICATION],
    queryFn: async () => {
      const response = await axiosPrivate.get('/user/announce?type=ACCOUNT')
      return response.data.data
    },
  })
  console.log(notifications)

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

  if (isLoading) return <LoadingComponent />

  return (
    <section className="mx-4 my-2 text-sm">
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="flex items-center justify-between border-b">
            <p className="text-xl">Thông báo của bạn</p>
            <button onClick={handleMarkAllAsRead} className="link text-primary">
              Đánh dấu tất cả đã đọc
            </button>
          </div>

          <div>
            {notifications.map((item: Notification) => (
              <div
                className={`grid grid-cols-12 my-2 gap-2 items-center p-2 rounded-lg ${
                  !item.seen ? 'bg-gray-200' : ''
                }`}
              >
                <div className="col-span-1">
                  <img src={image} alt="" className="w-16 h-16 object-cover" />
                </div>
                <div className="col-span-9">
                  <p className="">{item.content[1]}</p>
                  <p className="italic text-gray-500">{item.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotifyManagement
