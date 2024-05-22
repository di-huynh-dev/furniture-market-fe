import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { selectSellerAuth } from '@/redux/reducers/seller/sellerAuthSlice'
import { ChatItem } from '@/types/chat.type'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Stomp, { Client, Message } from 'stompjs'
import SockJS from 'sockjs-client'
import { SOCKET_REGISTER_URL, SOCKET_USER_TOPIC_PREFIX_URL } from '@/libs/socker-client'
import { UserType } from '@/types/user.type'
import { IoIosSend } from 'react-icons/io'
import { useForm } from 'react-hook-form'
import Sidebar from './components/Sidebar'
import ChatContent from './components/ChatContent'
import { LoadingComponent } from '@/components'

type FormData = {
  message: string
}

const ChatCenter = () => {
  const axiosPrivate = useAxiosPrivate()
  const user = useSelector(selectSellerAuth)
  const [client, setClient] = useState<Client | null>(null)
  const [receiverId, setReceiverId] = useState<string | null>('')
  const [receiverName, setReceiverName] = useState<string | null>('')
  const [messages, setMessages] = useState<ChatItem[]>([])

  const { data: userSentMessages, isLoading: isLoadingUserSentMessages } = useQuery({
    queryKey: [Seller_QueryKeys.LIST_USER_SENT_MESSAGE],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`/common/message/${user.authData.user.id}/opponents`)
      return resp.data.data
    },
    enabled: !!user.authData.user.id,
  })

  useEffect(() => {
    if (user.authData.user.id) {
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
  }, [user.authData.user.id, receiverId, userSentMessages])

  useEffect(() => {
    if (receiverId) {
      listMessagesOfReceiverMutation.mutate(receiverId)
    }
  }, [receiverId])

  const listMessagesOfReceiverMutation = useMutation({
    mutationFn: async (receiverId: string) => {
      const resp = await axiosPrivate.post(`/common/message/list-message?opponentId=${receiverId}`)
      console.log('resp', resp.data.data)

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

  const updateMessages = (message: ChatItem) => {
    const isMessageExist = messages.some((msg: ChatItem) => msg.randomHash === message.randomHash)
    if (!isMessageExist) {
      setMessages((prevMessages) => [...prevMessages, message])
    }
  }

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
  const { register, handleSubmit, reset } = useForm<FormData>()

  const onSubmit = handleSubmit((data) => {
    handleSendMessage(data.message)
  })
  if (isLoadingUserSentMessages) return <LoadingComponent />

  return (
    <section className="mx-4 my-2 text-sm e">
      <div className="card shadow-lg bg-white">
        <div className="card-body h-[700px]">
          <div>
            <div className="grid grid-cols-10 gap-4">
              <Sidebar receiverId={receiverId} handleChooseReceiver={handleChooseReceiver} />
              <div
                className="col-span-8 overflow-y-auto max-h-[600px]"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #E5E7EB' }}
              >
                <div>
                  <p>Người nhận: {receiverName}</p>
                  <ChatContent messages={messages} />

                  <div className="bottom-0 fixed right-0 left-[250px]">
                    <form onSubmit={onSubmit}>
                      <div className="w-full flex items-center">
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
    </section>
  )
}

export default ChatCenter
