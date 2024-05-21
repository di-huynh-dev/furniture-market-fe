import { ChatItem } from '@/types/chat.type'

const MyMessageItem = ({ item }: { item: ChatItem }) => {
  return (
    <div>
      <div className="chat chat-end">
        {item.image && (
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img src={item.image} className="w-6 h-6  object-cover" alt="avatar" />
            </div>
          </div>
        )}

        <div className="chat-header">
          <time className="text-xs opacity-50">{item.createdAt}</time>
        </div>
        <div className="chat-bubble">{item.content || item.message}</div>
        <div className="chat-footer opacity-50">{item.read ? 'Seen' : ''}</div>
      </div>
    </div>
  )
}

export default MyMessageItem
