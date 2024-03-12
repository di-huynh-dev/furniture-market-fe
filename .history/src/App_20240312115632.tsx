import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { BuyerLogin, BuyerSignup, Landing } from './pages'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
    },
    {
      path: '/auth/login',
      element: <BuyerLogin />,
    },
    {
      path: '/auth/signup',
      element: <BuyerSignup />,
    },
  ])
  return <RouterProvider router={router} />
}

export default App
