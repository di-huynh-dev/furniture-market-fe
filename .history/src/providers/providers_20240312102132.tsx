import { queryCLient } from '@/libs/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { PropsWithChildren } from 'react'

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryCLient}>
      <Provider store={store}>
        <Router>{children}</Router>
      </Provider>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default Providers
