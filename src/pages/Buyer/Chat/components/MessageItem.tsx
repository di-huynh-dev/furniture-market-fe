import { ChatItem } from '@/types/chat.type'

const MessageItem = ({ item }: { item: ChatItem }) => {
  return (
    <div className="chat chat-start" key={item.randomHash}>
      {item.image && <img src={item.image} alt="avatar" />}
      <div className="chat-header">
        <time className="text-xs opacity-50">{item.createdAt}</time>
      </div>
      <div className="chat-bubble">{item.message}</div>
      <div className="chat-footer opacity-50">{item.read ? 'Seen' : ''}</div>
    </div>
  )
}

export default MessageItem
