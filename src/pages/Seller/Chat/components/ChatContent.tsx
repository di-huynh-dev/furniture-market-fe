import { ChatItem } from '@/types/chat.type'
import MyMessageItem from './MyMessageItem'
import MessageItem from './MessageItem'
import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { selectSellerAuth } from '@/redux/reducers/seller/sellerAuthSlice'

interface ChatContentProps {
  messages: ChatItem[] // Define the prop type here
}

const ChatContent = ({ messages }: ChatContentProps) => {
  const user = useSelector(selectSellerAuth)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])
  const filteredMessages = messages.map((message: ChatItem, index) => {
    if (message.senderId === user.authData.user.id) {
      return <MyMessageItem key={index} item={message} />
    } else {
      return <MessageItem key={index} item={message} />
    }
  })
  return (
    <>
      <div className="row-span-4">{filteredMessages}</div>
      <div ref={messagesEndRef} />
    </>
  )
}

export default ChatContent
