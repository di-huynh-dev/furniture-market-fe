import { SOCKET_USER_TOPIC_PREFIX_URL } from '@/libs/socker-client'
import { useState } from 'react'
import { messages } from 'react-stomp-hooks/dist/mock/client'
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
      `${SOCKET_USER_TOPIC_PREFIX_URL}/${'c54aa696-8e96-4003-89c7-25dd389ec57c'}`,
      function (message) {
        console.log(message)
        setLastMessage(message.body)
      },
    )
  })
  // senderId: '866c5d82-1b9d-47f1-91ee-fe965dcd6cd2',
  // receiverId: 'f80eac3b-8e67-4c9c-996f-238edaed6564',
  // Gửi tin nhắn mới
  const sendMessage = () => {
    const newMessage = {
      senderId: 'c54aa696-8e96-4003-89c7-25dd389ec57c',
      receiverId: 'da16e519-ca2d-43ba-a674-f8e29e654b4d',
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
