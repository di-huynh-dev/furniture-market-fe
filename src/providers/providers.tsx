import { queryCLient } from '@/libs/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Bounce, ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import { store, persistor } from '@/redux/store'
import { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'
import { PersistGate } from 'redux-persist/integration/react'
import { LuArrowUpToLine } from 'react-icons/lu'

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryCLient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <div className="fixed bottom-24 animate-bounce right-10 flex items-center gap-2 bg-white p-2 rounded-full text-primary z-[101]">
            <LuArrowUpToLine
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer w-6 h-6 "
            />
          </div>
          {children}
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
