import { IoIosSend } from 'react-icons/io'
import { FaRegWindowClose } from 'react-icons/fa'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import { useMutation, useQuery } from '@tanstack/react-query'
import { selectAuth } from '@/redux/reducers/authSlice'
import { useSelector } from 'react-redux'
import { SOCKET_REGISTER_URL, SOCKET_USER_TOPIC_PREFIX_URL } from '@/libs/socker-client'
import SockJS from 'sockjs-client'
import { useEffect, useState } from 'react'
import Stomp, { Client, Message } from 'stompjs'
import { ChatItem } from '@/types/chat.type'
import { useForm } from 'react-hook-form'
import { CiCamera } from 'react-icons/ci'
import Sidebar from './components/Sidebar'
import ChatContent from './components/ChatContent'
import { UserType } from '@/types/user.type'

interface ChatCenterProps {
  showChat: boolean
  toggleChat: () => void
  receiver: { id: string; name: string }
}

type FormData = {
  message: string
}

const ChatCenter: React.FC<ChatCenterProps> = ({ showChat, toggleChat, receiver }) => {
  const axiosPrivate = useAxiosBuyerPrivate()
  const user = useSelector(selectAuth)
  const [client, setClient] = useState<Client | null>(null)
  const [receiverId, setReceiverId] = useState<string | null>(receiver?.id || '')
  const [receiverName, setReceiverName] = useState<string | null>(receiver?.name || '')
  const [messages, setMessages] = useState<ChatItem[]>([])
  console.log(messages)

  // const [imgView, setImgView] = useState<File | null>(null)
  // const [image, setImage] = useState('')

  const { data: userSentMessages, isLoading: isLoadingUserSentMessages } = useQuery({
    queryKey: [Buyer_QueryKeys.LIST_USER_SENT_MESSAGE],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`/common/message/${user.authData.user.id}/opponents`)
      return resp.data.data
    },
    enabled: !!user.authData.user.id,
  })

  useEffect(() => {
    if (showChat && user.authData.user.id) {
      const socket = new SockJS(SOCKET_REGISTER_URL)
      const stompClient = Stomp.over(socket)

      stompClient.connect({}, () => {
        stompClient.subscribe(`${SOCKET_USER_TOPIC_PREFIX_URL}/${user.authData.user.id}`, (message: Message) => {
          const newMessage = JSON.parse(message.body)
          if (newMessage.senderId === receiverId || newMessage.receiverId === receiverId) {
            updateMessages(newMessage)
          }
        })
        setClient(stompClient)
      })

      return () => {
        if (client) {
          client.disconnect(() => {
            console.log('Disconnected from chat center')
          })
        }
      }
    }
  }, [showChat, user.authData.user.id, receiverId, userSentMessages])

  useEffect(() => {
    if (receiverId) {
      listMessagesOfReceiverMutation.mutate(receiverId)
    }
  }, [receiverId])

  const updateMessages = (message: ChatItem) => {
    const isMessageExist = messages.some((msg: ChatItem) => msg.randomHash === message.randomHash)
    if (!isMessageExist) {
      setMessages((prevMessages) => [...prevMessages, message])
    }
  }

  // const handleUploadFile = async (file: File) => {
  //   const formData = new FormData()
  //   formData.append('image', file)
  //   try {
  //     const resp = await axiosPrivate.post('/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     })
  //     if (resp.status === 200) {
  //       setImage(resp.data.data['image-url'])
  //       setImgView(null)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const handleSendMessage = (message: string) => {
    // if (imgView) {
    //   handleUploadFile(imgView)
    // }

    if (client && receiverId) {
      const newMessage: ChatItem = {
        senderId: user.authData.user.id,
        receiverId: receiverId,
        message: message,
        createdAt: new Date().toISOString(),
        type: 'MESSAGE',
        randomHash: Math.random().toString(),
      }
      client.send(`/ws/secured/messenger`, {}, JSON.stringify(newMessage))
      listMessagesOfReceiverMutation.mutate(receiverId)

      reset()
    }
  }

  const listMessagesOfReceiverMutation = useMutation({
    mutationFn: async (receiverId: string) => {
      const resp = await axiosPrivate.post(`/common/message/list-message?opponentId=${receiverId}`)
      return resp.data.data
    },
    onSuccess: (messages) => {
      setMessages(messages)
    },
  })

  const handleChooseReceiver = (user: UserType) => {
    setReceiverId(user.id)
    setReceiverName(user.fullName)
  }

  const { register, handleSubmit, reset } = useForm<FormData>()

  const onSubmit = handleSubmit((data) => {
    handleSendMessage(data.message)
  })

  if (isLoadingUserSentMessages) return <div>Loading...</div>

  return (
    showChat && (
      <div className="fixed bottom-0 right-0  w-[650px] z-[999] text-sm">
        <div className="bg-white rounded-lg shadow-lg p-4 h-[500px]">
          <div className="mb-2 border-b flex justify-between">
            <h3 className="text-lg font-semibold text-primary">
              Chat center <p className="badge badge-secondary text-white">{userSentMessages?.length}</p>
            </h3>
            <button onClick={toggleChat}>
              <FaRegWindowClose className="w-5 h-5 text-primary" />
            </button>
          </div>
          <div className="">
            <div className="grid grid-cols-10 gap-4">
              <Sidebar receiverId={receiverId} handleChooseReceiver={handleChooseReceiver} />
              <div
                className="col-span-7 overflow-y-auto h-[380px]"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #E5E7EB' }}
              >
                <div>
                  <p>Người nhận: {receiverName}</p>
                  <ChatContent messages={messages} />

                  <div className="bottom-0 fixed w-[430px]">
                    <form onSubmit={onSubmit}>
                      <div className="w-full flex mb-2 items-center">
                        <input
                          type="text"
                          {...register('message', { required: true })}
                          placeholder="Nhập nội dung tin nhắn"
                          className="input input-bordered input-neutral w-full"
                        />
                        {/* <label className="form-control">
                          <input
                            type="file"
                            id="fileInput"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setImgView(e.target.files[0])
                              }
                            }}
                            className="hidden"
                          />
                          {imgView && (
                            <div className="fixed bottom-0 right-40 mb-5">
                              <img src={URL.createObjectURL(imgView)} className="w-8 h-8 object-cover" alt="" />
                            </div>
                          )}
                          <label htmlFor="fileInput" className="cursor-pointer">
                            <CiCamera className="w-6 h-6 mx-2" />
                          </label>
                        </label> */}
                        <button type="submit" className="btn btn-primary text-white">
                          <IoIosSend />
                          Gửi
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default ChatCenter
