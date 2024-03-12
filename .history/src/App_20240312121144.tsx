import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import { BuyerLogin, BuyerSignup } from './pages/Buyer'
import { SellerHome, SellerLogin, SellerSignup } from './pages/Seller'

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
      children: [
        {
          path: '/seller/sale/order',
          element: <SellerHome />,
        },
        {
          path: '/seller/products',
          element: <SellerHome />,
        },
        {
          path: '/seller/products/:id',
          element: <SellerHome />,
        },
        {
          path: '/seller/products/:id/edit',
          element: <SellerHome />,
        },
        {
          path: '/seller/products/:id/delete',
          element: <SellerHome />,
        },
      ],
    },
  ])
  return <RouterProvider router={router} />
}

export default App
