import { queryCLient } from '@/libs/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Bounce, ToastContainer } from 'react-toastify'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'react-redux'
import { store, persistor } from '@/redux/store'
import { PropsWithChildren, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { PersistGate } from 'redux-persist/integration/react'
import { StompSessionProvider } from 'react-stomp-hooks'
import { SOCKET_REGISTER_URL } from '@/libs/socker-client'
import { ChatCenter } from '@/pages/Buyer'
import { LuArrowUpToLine } from 'react-icons/lu'
import { BsChatRightQuote } from 'react-icons/bs'

const Providers = ({ children }: PropsWithChildren) => {
  const [showChat, setShowChat] = useState(false)

  const toggleChat = () => {
    setShowChat(!showChat)
  }
  return (
    <QueryClientProvider client={queryCLient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <div className="fixed bottom-20 animate-bounce right-5 flex items-center gap-2 bg-white p-2 rounded-full text-primary">
            <LuArrowUpToLine
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer w-6 h-6 "
            />
          </div>
          <button
            onClick={toggleChat}
            className="fixed bottom-5 right-5 flex items-center gap-2 bg-primary p-2 rounded-lg text-white"
          >
            <BsChatRightQuote className="cursor-pointer w-10 h-10" />
            <p className="font-bold">Chat</p>
          </button>
          <StompSessionProvider url={SOCKET_REGISTER_URL}>
            {/* <ChatCenter showChat={showChat} toggleChat={toggleChat} /> */}
            {children}
          </StompSessionProvider>
        </PersistGate>
      </Provider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Toaster />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}

export default Providers
