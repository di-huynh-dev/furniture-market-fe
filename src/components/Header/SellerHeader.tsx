/* eslint-disable @typescript-eslint/no-explicit-any */
import Logo from '@/assets/Logo/logo-color.svg'
import { CiBellOn } from 'react-icons/ci'
import { removeAuth, selectSellerAuth } from '@/redux/reducers/seller/sellerAuthSlice'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { ConfirmModal } from '..'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import useWebSocket from '@/hooks/useWebSocket'
import { useEffect, useState } from 'react'
import { SOCKET_NOTIFY_TOPIC_PREFIX_URL } from '@/libs/socker-client'
import type { Notification } from '@/types/notify.type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import accountImage from '@/assets/images/account-setting.jpg'

const SellerHeader = () => {
  const user = useSelector(selectSellerAuth)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const navigation = useNavigate()
  const dispatch = useDispatch()

  const client = useWebSocket()
  useEffect(() => {
    if (client) {
      const topic = `${SOCKET_NOTIFY_TOPIC_PREFIX_URL}/${user.authData.user.id}`
      client.subscribe(topic, (message: { body: string }) => {
        try {
          const newNotification: Notification = {
            id: '',
            createdAt: '',
            type: '',
            seen: false,
            content: ['', message.body],
          }
          setNotifications((prev) => [...prev, newNotification])
        } catch (error) {
          console.error('Failed to parse notification message:', error)
        }
      })
    }
  }, [client, user.authData.user.id])

  const { isLoading } = useQuery({
    queryKey: [Seller_QueryKeys.USER_NOTIFICATION],
    queryFn: async () => {
      const response = await axiosPrivate.get('/user/announce?type=ACCOUNT')
      if (response.status === 200) {
        setNotifications(response.data.data.content)
      }
      return response.data.data
    },
  })

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

  const handleMarkAsRead = async (id: string) => {
    try {
      const resp = await axiosPrivate.patch(`/user/announce/mark-as-read/${id}`)
      if (resp.status === 200) {
        queryClient.invalidateQueries({ queryKey: [Seller_QueryKeys.USER_NOTIFICATION] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const showModal = () => {
    const modalElement = document.getElementById('confirm_modal') as HTMLDialogElement
    if (modalElement) {
      modalElement.showModal()
    }
  }
  const handleLogout = () => {
    dispatch(removeAuth())
    toast.success('Đăng xuất tài khoản thành công!')
  }

  return (
    <header className="shadow-md bg-base-100 text-base-content sticky top-0 z-30 flex h-24 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)]">
      <ConfirmModal content="Bạn có muốn đăng xuất" onClick={handleLogout} />
      <div className="navbar bg-base-100">
        <button onClick={() => navigation('/seller')} tabIndex={0} className="flex-none">
          <img src={Logo} alt="" className="w-24 h-24 object-cover" />
        </button>
        <div className="flex-1">
          <p className="text-xl font-bold text-neutral">Fnest Kênh người bán</p>
        </div>
        <div className="flex-none">
          <div className="hidden flex-none items-center lg:block">
            <div className="dropdown dropdown-hover dropdown-bottom dropdown-end mx-5">
              <div tabIndex={0} role="button" className="indicator drawer-button font-normal">
                <CiBellOn className="w-8 h-8" />
                {notifications.filter((notification) => !notification.seen).length > 0 && (
                  <div className="indicator-item badge badge-secondary text-white">
                    {notifications.filter((notification) => !notification.seen).length}
                  </div>
                )}
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1]  p-2 shadow bg-base-100 rounded-box w-96">
                <>
                  <div className="flex justify-between items-center border-b p-2 text-xs">
                    <p className="text-primary ">Thông báo đã nhận gần đây</p>
                    <button onClick={handleMarkAllAsRead} className="link">
                      Đánh dấu tất cả đã đọc
                    </button>
                  </div>

                  <div className="menu scrollbar-thin h-96">
                    <div className="overflow-y-auto">
                      {isLoading ? (
                        <p>Đang tải dữ liệu...</p>
                      ) : (
                        <>
                          <p className="text-gray-500">Thông báo tài khoản</p>
                          {notifications.slice(0, 10).map((notification, index) => (
                            <div
                              key={index}
                              className={`mb-2 px-3 rounded-lg text-xs border-b grid grid-cols-10 items-center gap-2 ${
                                notification.seen ? '' : 'bg-gray-100'
                              }`}
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <img src={accountImage} alt="" className="w-16 object-cover col-span-1" />
                              <div className="col-span-9">
                                <p>{notification.content[1]}</p>
                                <p className="text-gray-500 italic">({notification.createdAt})</p>
                              </div>
                            </div>
                          ))}
                          {notifications.length > 5 && (
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
              </ul>
            </div>
          </div>

          <div className="dropdown dropdown-end">
            <div className="flex items-center justify-center">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user.authData.user.avatar} alt="" />
                </div>
              </div>
              <p>{user.authData.user.fullName}</p>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/seller/settings/profile" className="justify-between">
                  Trang cá nhân
                </Link>
              </li>

              <li onClick={showModal}>
                <a>Đăng xuất</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SellerHeader
