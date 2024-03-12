import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { BuyerLogin, BuyerSignup, Landing, SellerLogin, SellerSignup } from './pages'

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
      element: <SellerLogin />,
    },
    {
      path: '/seller/sigup',
      element: <SellerSignup />,
    },
  ])
  return <RouterProvider router={router} />
}

export default App
