import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import { BuyerLogin, BuyerSignup } from './pages/Buyer'
import { MarketingManagement, ProductsManagement, SellerHome, SellerLogin, SellerSignup } from './pages/Seller'
import OrdersManagement from './pages/Seller/Orders/OrdersManagement'

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
          path: '/seller/sale/orders',
          element: <OrdersManagement />,
        },
        {
          path: '/seller/products',
          element: <ProductsManagement />,
        },
        {
          path: '/seller/marketing',
          element: <MarketingManagement />,
        },
      ],
    },
  ])
  return <RouterProvider router={router} />
}

export default App
