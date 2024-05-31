/* eslint-disable @typescript-eslint/no-explicit-any */
import Logo from '@/assets/Logo/logo-color.svg'
import { CiBellOn, CiMenuBurger } from 'react-icons/ci'
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
import useImagePreview from '@/hooks/useImagePreview'

const SellerHeader = () => {
  const user = useSelector(selectSellerAuth)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationsReport, setNotificationsReport] = useState<Notification[]>([])
  const [selectedReport, setSelectedReport] = useState('')
  const [images, setImages] = useState<File[]>([])
  const { previewImages, handleFileChange } = useImagePreview()
  const [description, setDescription] = useState('')
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

  const { isLoading: isLoadingUsers } = useQuery({
    queryKey: [Seller_QueryKeys.USER_NOTIFICATION],
    queryFn: async () => {
      const response = await axiosPrivate.get('/user/announce?type=ACCOUNT')
      if (response.status === 200) {
        setNotifications(response.data.data.content)
      }
      return response.data.data
    },
  })

  const { isLoading: isLoadingReport } = useQuery({
    queryKey: [Seller_QueryKeys.REPORT_NOTIFICATION],
    queryFn: async () => {
      const response = await axiosPrivate.get('/user/announce?type=REPORT')
      if (response.status === 200) {
        setNotificationsReport(response.data.data.content)
      }
      return response.data.data.content
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
  const handleExplainReport = async () => {
    try {
      if (!description || images.length === 0) {
        toast.error('Vui lý nhập đầy đủ thông tin!')
        return
      }

      const formData = new FormData()

      const info = {
        description: description,
        reportId: selectedReport,
      }
      const json = JSON.stringify(info)
      const blob = new Blob([json], {
        type: 'application/json',
      })
      formData.append('info', blob)
      for (const image of images) {
        formData.append('images', image)
      }

      const resp = await axiosPrivate.post('/seller/report/explanation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        const dialog = document.getElementById('my_modal_3') as HTMLDialogElement
        dialog.close()
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  return (
    <header className="shadow-md bg-base-100 text-base-content sticky top-0 z-30 flex h-24 w-full justify-center bg-opacity-90 backdrop-blur transition-shadow duration-100 [transform:translate3d(0,0,0)]">
      <dialog id="my_modal_3" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Giải trình sai phạm</h3>
          <p>Hình ảnh minh chứng</p>
          <input
            id="logo"
            type="file"
            accept="image/*"
            className="input input-bordered text-sm w-full"
            onChange={(e) => {
              handleFileChange(e)
              setImages(Array.from(e.target.files || []))
            }}
            multiple
          />
          <div className="grid grid-cols-4 gap-2">
            {previewImages &&
              previewImages.map((image, index) => (
                <div key={`back-${index}`} className="mt-2 flex">
                  <img src={image} alt={`Back Preview ${index}`} className="w-80 h-60 object-contain" />
                </div>
              ))}
          </div>
          <div className="my-2">
            <p>Mô tả chi tiết</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full"
              placeholder="Mô tả thêm"
            ></textarea>
          </div>
          <div className="modal-action">
            <div className="flex gap-2">
              <button onClick={handleExplainReport} className="btn btn-primary text-white">
                Gửi
              </button>
              <button
                onClick={() => {
                  const dialog = document.getElementById('my_modal_3') as HTMLDialogElement
                  dialog.close()
                }}
                className="btn"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </dialog>
      <ConfirmModal content="Bạn có muốn đăng xuất" onClick={handleLogout} />
      <div className="navbar bg-base-100">
        <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button lg:hidden">
          <CiMenuBurger />
        </label>
        <button onClick={() => navigation('/seller')} tabIndex={0} className="flex-none">
          <img src={Logo} alt="" className="w-24 h-24 object-cover" />
        </button>
        <div className="flex-1">
          <p className="md:text-xl font-bold text-neutral">Fnest Kênh người bán</p>
        </div>
        <div className="flex-none">
          <div className=" flex-none items-center ">
            <div className="dropdown dropdown-hover dropdown-bottom dropdown-end mx-5 hidden md:block">
              <div tabIndex={0} role="button" className="indicator drawer-button font-normal">
                <CiBellOn className="w-8 h-8" />
                {!notifications && !notificationsReport ? (
                  <span className=" badge badge-secondary text-white badge-sm">0</span>
                ) : (
                  <>
                    <div className="badge badge-secondary text-white badge-sm">
                      {notifications.filter(({ seen }) => !seen).length +
                        notificationsReport.filter(({ seen }) => !seen).length}{' '}
                    </div>
                  </>
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

                  <div className="menu scrollbar-thin lg:h-96 h-64">
                    <div className="overflow-y-auto">
                      {isLoadingUsers || isLoadingReport ? (
                        <p>Đang tải dữ liệu...</p>
                      ) : (
                        <>
                          {notifications.length > 0 && <p className="text-gray-500">Thông báo tài khoản</p>}
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
                          {notificationsReport.length > 0 && <p className="text-gray-500">Thông báo về báo cáo</p>}
                          {notificationsReport.slice(0, 10).map((notification, index) => (
                            <div
                              key={index}
                              className={`mb-2 px-3 rounded-lg text-xs border-b grid grid-cols-10 items-center gap-2 ${
                                notification.seen ? '' : 'bg-gray-100'
                              }`}
                              onClick={() => {
                                handleMarkAsRead(notification.id)
                                if (
                                  notification.content[1] ===
                                  'Bạn nhận được yêu cầu giải trình do cửa hàng bạn bị báo cáo!'
                                ) {
                                  setSelectedReport(notification.content[0])
                                  const dialog = document.getElementById('my_modal_3') as HTMLDialogElement
                                  dialog.showModal()
                                }
                              }}
                            >
                              <img src={accountImage} alt="" className="w-16 object-cover col-span-1" />
                              <div className="col-span-9">
                                <p>{notification.content[1]}</p>
                                <p className="text-gray-500 italic">({notification.createdAt})</p>
                              </div>
                            </div>
                          ))}
                          {notificationsReport.length > 5 && (
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
              <p className="hidden md:block">{user.authData.user.fullName}</p>
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
