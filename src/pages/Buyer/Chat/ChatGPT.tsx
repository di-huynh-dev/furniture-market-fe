import { SOCKET_USER_TOPIC_PREFIX_URL } from '@/libs/socker-client'
import { useState } from 'react'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

const ChatGPT = () => {
  const [lastMessage, setLastMessage] = useState('No message received yet')
  const [inputMessage, setInputMessage] = useState('')

  // Tạo kết nối SockJS tới máy chủ Stomp
  const sock = new SockJS(`http://localhost:8080/ws/secured`)
  const stompClient = Stomp.over(sock)

  sock.onopen = function () {
    console.log('open')
  }

  // Khi kết nối được thiết lập, gửi và nhận tin nhắn
  stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame)
    // Subscribe vào kênh tin nhắn của người dùng
    stompClient.subscribe(
      `${SOCKET_USER_TOPIC_PREFIX_URL}/${'dc9a638f-fc1d-4de1-9308-63b5e1aa8ed8'}`,
      function (message) {
        console.log(message)
        setLastMessage(message.body)
      },
    )
  })
  // senderId: 'dc9a638f-fc1d-4de1-9308-63b5e1aa8ed8',
  // receiverId: 'eab55d5e-8b07-424e-88b9-534739185e33',
  // Gửi tin nhắn mới
  const sendMessage = () => {
    const newMessage = {
      senderId: 'dc9a638f-fc1d-4de1-9308-63b5e1aa8ed8',
      receiverId: 'eab55d5e-8b07-424e-88b9-534739185e33',
      message: inputMessage,
      createdAt: new Date().toISOString(), // Sử dụng thời gian hiện tại
      type: 'MESSAGE',
      randomHash: Math.random().toString(),
    }
    console.log('Sending message:', newMessage)
    // Gửi tin nhắn qua kết nối Stomp
    stompClient.send(
      `/ws/secured/messenger`, // Đường dẫn đích
      {}, // Headers
      JSON.stringify(newMessage), // Nội dung tin nhắn cần được chuyển thành chuỗi JSON
    )
    setInputMessage('')
  }

  return (
    <div>
      <div>Last Message: {lastMessage}</div>
      <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default ChatGPT
