import { queryCLient } from '@/libs/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Bounce, ToastContainer } from 'react-toastify'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { PropsWithChildren } from 'react'
import { Toaster } from 'react-hot-toast'

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryCLient}>
      <Provider store={store}>{children}</Provider>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default Providers
