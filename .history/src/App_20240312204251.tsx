import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import { BuyerLogin, BuyerSignup } from './pages/Buyer'
import {
  ChatCenter,
  IncomeManagement,
  MarketingManagement,
  OrdersManagement,
  ProductsManagement,
  SellerHome,
  SellerLogin,
  SellerSignup,
  Setting,
  ShopManagement,
} from './pages/Seller'
import { buyer_routes, seller_routes } from './constants/routes-link'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
    },
    {
      path: buyer_routes.login,
      element: <BuyerLogin />,
    },
    {
      path: buyer_routes.signup,
      element: <BuyerSignup />,
    },
    {
      path: seller_routes.login,
      element: <SellerLogin />,
    },
    {
      path: seller_routes.signup,
      element: <SellerSignup />,
    },
    {
      path: seller_routes.seller,
      element: <SellerHome />,
      children: [
        {
          path: seller_routes.orders,
          element: <OrdersManagement />,
        },
        {
          path: seller_routes.products,
          element: <ProductsManagement />,
        },
        {
          path: seller_routes.marketing,
          element: <MarketingManagement />,
        },
        {
          path: seller_routes.income,
          element: <IncomeManagement />,
        },
        {
          path: seller_routes.chat,
          element: <ChatCenter />,
        },
        {
          path: seller_routes.settings,
          element: <Setting />,
        },
        {
          path: seller_routes.shop,
          element: <ShopManagement />,
        },
      ],
    },
  ])
  return <RouterProvider router={router} />
}

export default App
