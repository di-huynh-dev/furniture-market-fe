/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buyer_QueryKeys } from '@/constants/query-keys'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import useWebSocket from '@/hooks/useWebSocket'
import { SOCKET_NOTIFY_TOPIC_PREFIX_URL } from '@/libs/socker-client'
import { selectAuth } from '@/redux/reducers/authSlice'
import { Notification } from '@/types/notify.type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { FaRegBell } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import accountImage from '@/assets/images/account-setting.jpg'
import orderImage from '@/assets/images/order-notify.jpg'

const HeaderNotify = () => {
  const user = useSelector(selectAuth)
  const axiosPrivate = useAxiosBuyerPrivate()
  const [notificationsAccount, setNotificationsAccount] = useState<Notification[]>([])
  const [notificationsOrder, setNotificationsOrder] = useState<Notification[]>([])
  const queryClient = useQueryClient()
  const navigation = useNavigate()
  const client = useWebSocket()

  useEffect(() => {
    if (client) {
      const topic = `${SOCKET_NOTIFY_TOPIC_PREFIX_URL}/${user.authData.user.id}`
      client.subscribe(topic, (message: { body: string }) => {
        try {
          const newNotification: Notification = {
            id: '',
            createdAt: new Date().toISOString(),
            type: '',
            seen: false,
            content: ['', message.body],
          }
          setNotificationsAccount([...notificationsAccount, newNotification])
        } catch (error: any) {
          toast.error('Failed to parse notification message:', error)
        }
      })
    }
  }, [client, user.authData.user.id, notificationsAccount, notificationsOrder])

  const { data: notificationsAccountData, isLoading: isLoadingNotifications } = useQuery({
    queryKey: [Buyer_QueryKeys.USER_NOTIFICATION],
    queryFn: async () => {
      const response = await axiosPrivate.get('/user/announce?type=ACCOUNT')
      if (response.status === 200) {
        setNotificationsAccount(response.data.data.content)
      }
      return response.data.data.content
    },
  })

  const { data: notificationsOrderData, isLoading: isLoadingOrders } = useQuery({
    queryKey: [Buyer_QueryKeys.ORDER_NOTIFICATION],
    queryFn: async () => {
      const response = await axiosPrivate.get('/user/announce?type=ORDER')
      if (response.status === 200) {
        setNotificationsOrder(response.data.data.content)
      }
      return response.data.data.content
    },
  })

  const handleMarkAllAsRead = async () => {
    try {
      const resp = await axiosPrivate.patch('/user/announce/mark-as-read')
      if (resp.status === 200) {
        queryClient.invalidateQueries({ queryKey: [Buyer_QueryKeys.USER_NOTIFICATION] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const resp = await axiosPrivate.patch(`/user/announce/mark-as-read/${id}`)
      if (resp.status === 200) {
        queryClient.invalidateQueries({ queryKey: [Buyer_QueryKeys.USER_NOTIFICATION] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }
  return (
    <>
      <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button" className=" drawer-button text-gray-600 hover:text-black flex  items-center">
          <FaRegBell className="mr-1" />
          Thông báo
          {!notificationsAccount && !notificationsOrder ? (
            <span className=" badge badge-secondary text-white ml-2 badge-sm">0</span>
          ) : (
            <>
              <div className="badge badge-secondary text-white ml-2 badge-sm">
                {notificationsAccount.filter((notification: Notification) => !notification.seen).length +
                  notificationsAccount.filter((notification: Notification) => !notification.seen).length}
              </div>
            </>
          )}
        </div>

        <ul tabIndex={0} className="dropdown-content z-[100] p-3 shadow bg-base-100 rounded-box w-96">
          {!notificationsAccount && !notificationsOrder ? (
            <p className="p-4 text-center">Bạn không có thông báo nào</p>
          ) : (
            <>
              <div className="flex justify-between items-center border-b p-2 text-xs">
                <p className="text-primary ">Thông báo đã nhận gần đây</p>
                <button onClick={handleMarkAllAsRead} className="link">
                  Đánh dấu tất cả đã đọc
                </button>
              </div>

              <div className="menu scrollbar-thin h-96">
                <div className="overflow-y-auto">
                  {isLoadingNotifications || isLoadingOrders ? (
                    <p>Đang tải dữ liệu...</p>
                  ) : (
                    <>
                      <p className="text-gray-500">Thông báo tài khoản</p>
                      {notificationsAccount.length === 0 && (
                        <p className="text-gray-500 text-center my-2">Chưa có thông báo nào</p>
                      )}
                      {notificationsAccount.slice(0, 5).map((notification: Notification, index: number) => (
                        <div
                          key={index}
                          className={`mb-2 border-b grid grid-cols-10 items-center gap-2 ${
                            notification.seen ? 'opacity-70' : ''
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <img src={accountImage} alt="" className="w-16 object-cover col-span-1" />
                          <div className="col-span-9">
                            <p>{notification.content[1]}</p>
                            <p className="text-gray-500 italic italic">({notification.createdAt})</p>
                          </div>
                        </div>
                      ))}
                      {notificationsOrder.length > 5 && (
                        <div className="text-center">
                          <button onClick={() => navigation('/seller/notify')} className="text-primary link">
                            Xem thêm
                          </button>
                        </div>
                      )}
                      <p className="text-gray-500">Thông báo đơn hàng</p>
                      {notificationsOrder.length === 0 && (
                        <p className="text-gray-500 text-center my-2 italic">Chưa có thông báo nào</p>
                      )}
                      {notificationsOrder.slice(0, 5).map((notification: Notification, index: number) => (
                        <div
                          key={index}
                          className={`mb-2 border-b grid grid-cols-10 items-center gap-2 ${
                            notification.seen ? 'opacity-70' : ''
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <img src={orderImage} alt="" className="w-16 object-cover col-span-1" />
                          <div className="col-span-9">
                            <p>{notification.content[1]}</p>
                            <p className="text-gray-500 italic">({notification.createdAt})</p>
                          </div>
                        </div>
                      ))}
                      {notificationsOrder.length > 5 && (
                        <div className="text-center">
                          <button onClick={() => navigation('/seller/notify')} className="text-primary link">
                            Xem thêm
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="text-center">
                <button onClick={() => navigation('/seller/notify')} className="text-gray-500 link">
                  Xem tất cả
                </button>
              </div>
            </>
          )}
        </ul>
      </div>
    </>
  )
}

export default HeaderNotify
