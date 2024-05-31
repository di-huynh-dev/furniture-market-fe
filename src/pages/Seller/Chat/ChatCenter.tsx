import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { selectSellerAuth } from '@/redux/reducers/seller/sellerAuthSlice'
import { ChatItem } from '@/types/chat.type'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState, useCallback, memo } from 'react'
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

const MemoizedSidebar = memo(Sidebar)
const MemoizedChatContent = memo(ChatContent)

const ChatCenter = () => {
  const axiosPrivate = useAxiosPrivate()
  const user = useSelector(selectSellerAuth)
  const [client, setClient] = useState<Client | null>(null)
  const [receiverId, setReceiverId] = useState<string | null>('')
  const [receiverName, setReceiverName] = useState<string | null>('')
  const [messages, setMessages] = useState<ChatItem[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Fnest Seller - Quản lý Chat'
  }, [])

  const { data: userSentMessages, isLoading: isLoadingUserSentMessages } = useQuery({
    queryKey: [Seller_QueryKeys.LIST_USER_SENT_MESSAGE],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`/common/message/${user.authData.user.id}/opponents`)
      return resp.data.data
    },
    enabled: !!user.authData.user.id,
  })

  useEffect(() => {
    scrollTo(0, 0)
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
      return resp.data.data
    },
    onSuccess: (messages) => {
      setMessages(messages)
    },
  })

  const handleChooseReceiver = useCallback((user: UserType) => {
    setReceiverId(user.id)
    setReceiverName(user.fullName)
  }, [])

  const updateMessages = useCallback(
    (message: ChatItem) => {
      const isMessageExist = messages.some((msg: ChatItem) => msg.randomHash === message.randomHash)
      if (!isMessageExist) {
        setMessages((prevMessages) => [...prevMessages, message])
      }
    },
    [messages],
  )

  const handleSendMessage = useCallback(
    (message: string) => {
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
    },
    [client, receiverId, user.authData.user.id, listMessagesOfReceiverMutation],
  )

  const { register, handleSubmit, reset } = useForm<FormData>()

  const onSubmit = handleSubmit((data) => {
    handleSendMessage(data.message)
  })

  if (isLoadingUserSentMessages) return <LoadingComponent />

  return (
    <section className="mx-4 my-2 text-sm lg:pr-20">
      <div className="card shadow-lg bg-white">
        <div className="card-body bg-white h-[calc(100vh-50px)] flex flex-col">
          <div className="flex-1 flex overflow-hidden">
            <MemoizedSidebar receiverId={receiverId} handleChooseReceiver={handleChooseReceiver} />
            <div
              className="flex-1 overflow-y-auto"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #E5E7EB' }}
            >
              <div className="p-4">
                <p>Người nhận: {receiverName}</p>
                <MemoizedChatContent messages={messages} />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <form onSubmit={onSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                {...register('message', { required: true })}
                placeholder="Nhập nội dung tin nhắn"
                className="input input-bordered input-neutral flex-1"
              />
              <button type="submit" className="btn btn-primary text-white flex items-center">
                <IoIosSend />
                <span className="ml-1">Gửi</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChatCenter
