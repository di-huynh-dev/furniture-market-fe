import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import {
  BuyerAccount,
  BuyerAddress,
  BuyerLogin,
  BuyerNotificationsOrder,
  BuyerOrderDetail,
  BuyerPassword,
  BuyerProfile,
  BuyerPurchase,
  BuyerSignup,
  BuyerVerify,
  BuyerVoucher,
} from './pages/Buyer'
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
import { SellerProtected } from './components'
import Error from './pages/Error/Error'
import HomeLayout from './pages/HomeLayout'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
      errorElement: <Error />,
      children: [
        { index: true, element: <HomeLayout /> },
        {
          path: buyer_routes.account,
          element: <BuyerAccount />,
          children: [
            { index: true, element: <BuyerProfile /> },
            {
              path: buyer_routes.purchase,
              element: <BuyerPurchase />,
            },
            {
              path: buyer_routes.order_detail,
              element: <BuyerOrderDetail />,
            },
            {
              path: buyer_routes.address,
              element: <BuyerAddress />,
            },
            {
              path: buyer_routes.change_password,
              element: <BuyerPassword />,
            },
            {
              path: buyer_routes.verify,
              element: <BuyerVerify />,
            },
            {
              path: buyer_routes.voucher,
              element: <BuyerVoucher />,
            },
            {
              path: buyer_routes.notifications_order,
              element: <BuyerNotificationsOrder />,
            },
          ],
        },
        {
          path: buyer_routes.login,
          element: <BuyerLogin />,
        },
        {
          path: buyer_routes.signup,
          element: <BuyerSignup />,
        },
      ],
    },

    {
      path: seller_routes.seller,
      element: (
        <SellerProtected>
          <SellerHome />
        </SellerProtected>
      ),
      children: [
        {
          path: seller_routes.login,
          element: <SellerLogin />,
        },
        {
          path: seller_routes.signup,
          element: <SellerSignup />,
        },
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
