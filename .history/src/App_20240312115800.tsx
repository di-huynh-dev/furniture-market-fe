import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { BuyerLogin, BuyerSignup, Landing } from './pages'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
    },
    {
      path: '/buyer/login',
      element: <BuyerLogin />,
    },
    {
      path: '/buyer/signup',
      element: <BuyerSignup />,
    },
    {
      path: '/seller/login',
      element: <BuyerLogin />,
    },
    {
      path: '/seller/sigup',
      element: <BuyerSignup />,
    },
  ])
  return <RouterProvider router={router} />
}

export default App
