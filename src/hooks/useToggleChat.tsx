import { useState } from 'react'

const useToggleChat = () => {
  const [showChat, setShowChat] = useState(false)

  const toggleChat = () => {
    setShowChat((prevShowChat) => !prevShowChat)
    if (showChat) {
      localStorage.removeItem('Receiver')
    }
  }

  return { showChat, toggleChat }
}

export default useToggleChat
