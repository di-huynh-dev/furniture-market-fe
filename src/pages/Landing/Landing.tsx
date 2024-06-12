import { BuyerFooter, BuyerHeader, TopHeader } from '@/components'
import { IoChatbubbleEllipses, IoCloseSharp } from 'react-icons/io5'
import { Outlet } from 'react-router-dom'
import { ChatCenter } from '../Buyer'
import { StompSessionProvider } from 'react-stomp-hooks'
import { SOCKET_REGISTER_URL } from '@/libs/socker-client'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/redux/reducers/authSlice'
import useToggleChat from '@/hooks/useToggleChat'
import { useState } from 'react'
import { FaFacebookMessenger, FaPhone } from 'react-icons/fa6'
import { SiZalo } from 'react-icons/si'
import { FaTelegramPlane } from 'react-icons/fa'

const Landing = () => {
  const user = useSelector(selectAuth)
  const { showChat, toggleChat } = useToggleChat()
  const [showAdditionalIcons, setShowAdditionalIcons] = useState(false)

  const handleChatButtonClick = () => {
    setShowAdditionalIcons(!showAdditionalIcons)
  }

  const handleOverlayClick = () => {
    setShowAdditionalIcons(false)
  }

  return (
    <div className="bg-[#f8f5f2]">
      {showAdditionalIcons && (
        <div className="fixed inset-0 bg-black opacity-50 z-[101]" onClick={handleOverlayClick} />
      )}
      {showAdditionalIcons && (
        <div className="fixed bottom-36 right-9 flex flex-col items-center gap-3 z-[102]">
          <button className="bg-green-500 p-3 rounded-full text-white">
            <FaPhone className="w-6 h-6" />
          </button>
          <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-3 rounded-full text-white">
            <FaFacebookMessenger className="w-6 h-6" />
          </button>
          <button className="bg-blue-500 p-3 rounded-full text-white">
            <SiZalo className="w-6 h-6" />
          </button>
          <button className="bg-[#30A7DB] p-3 rounded-full text-white">
            <FaTelegramPlane className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              setShowAdditionalIcons(false)
              toggleChat()
            }}
            className="bg-[#ec994b] p-3 rounded-full text-white"
          >
            <IoChatbubbleEllipses className="w-6 h-6" />
          </button>
        </div>
      )}
      <button
        onClick={handleChatButtonClick}
        className={`fixed bottom-10 right-9 flex items-center gap-3 bg-primary p-3 rounded-full text-white z-[101] ${
          showAdditionalIcons ? 'bg-red-600' : 'bg-primary'
        }`}
      >
        {showAdditionalIcons ? (
          <IoCloseSharp size={24} className="text-white" />
        ) : (
          <IoChatbubbleEllipses size={24} className="text-white" />
        )}
      </button>
      {user.authData?.user?.id && (
        <StompSessionProvider url={SOCKET_REGISTER_URL}>
          <ChatCenter showChat={showChat} toggleChat={toggleChat} receiver={{ id: '', name: '' }} />
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
