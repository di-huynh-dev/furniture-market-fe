import { BuyerFooter, BuyerHeader, TopHeader } from '@/components'
import { useState } from 'react'
import { BsChatRightQuote } from 'react-icons/bs'
import { Outlet } from 'react-router-dom'
import { ChatCenter } from '../Buyer'
import { StompSessionProvider } from 'react-stomp-hooks'
import { SOCKET_REGISTER_URL } from '@/libs/socker-client'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/redux/reducers/authSlice'

const Landing = () => {
  const [showChat, setShowChat] = useState(false)
  const user = useSelector(selectAuth)
  const toggleChat = () => {
    setShowChat(!showChat)
  }

  return (
    <div className="bg-[#EDECEF]">
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 flex items-center gap-2 bg-primary p-2 rounded-lg text-white"
      >
        <BsChatRightQuote className="cursor-pointer w-10 h-10" />
        <p className="font-bold">Chat</p>
      </button>
      {user.authData?.user?.id && (
        <StompSessionProvider url={SOCKET_REGISTER_URL}>
          <ChatCenter showChat={showChat} toggleChat={toggleChat} />
        </StompSessionProvider>
      )}
      <TopHeader />
      <BuyerHeader />
      <Outlet />
      <BuyerFooter />
    </div>
  )
}

export default Landing
