import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { BuyerLogin, BuyerSignup, Landing, SellerHome, SellerLogin, SellerSignup } from './pages'

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
    {
      path: '/seller',
      element: <SellerHome />,
    },
  ])
  return <RouterProvider router={router} />
}

export default App
