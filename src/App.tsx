import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import {
  BuyerAccount,
  BuyerAddress,
  BuyerCart,
  BuyerLogin,
  BuyerNotificationsOrder,
  BuyerOrderDetail,
  BuyerPassword,
  BuyerProfile,
  BuyerPurchase,
  BuyerSignup,
  BuyerVerify,
  BuyerVoucher,
  BuyerWhishlist,
} from './pages/Buyer'
import {
  AddProduct,
  BannedProduct,
  CancelledOrder,
  ChatCenter,
  CompletedOrder,
  FailedDeliveryOrder,
  IncomeManagement,
  MarketingManagement,
  OrdersManagement,
  ProductBrand,
  ProductsManagement,
  ReturnOrder,
  SellerHome,
  SellerLogin,
  SellerSignup,
  Setting,
  SettingProfile,
  ShippingOrder,
  ShopManagement,
  ToshipOrder,
  UnpaidOrder,
} from './pages/Seller'
import { buyer_routes, seller_routes } from './constants/routes-link'
import { SellerProtected } from './components'
import Error from './pages/Error/Error'
import HomeLayout from './pages/HomeLayout'
import ConfirmEmail from './pages/Common/ConfirmEmail'

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
          path: buyer_routes.cart,
          element: <BuyerCart />,
        },
        {
          path: buyer_routes.whishlist,
          element: <BuyerWhishlist />,
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
          path: buyer_routes.confirm_email,
          element: <ConfirmEmail />,
        },
      ],
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
      path: seller_routes.confirm_email,
      element: <ConfirmEmail />,
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
          path: seller_routes.orders,
          element: <OrdersManagement />,
          children: [
            {
              path: seller_routes.orders_unpaid,
              element: <UnpaidOrder />,
            },
            {
              path: seller_routes.orders_toship,
              element: <ToshipOrder />,
            },
            {
              path: seller_routes.orders_shipping,
              element: <ShippingOrder />,
            },
            {
              path: seller_routes.orders_compelted,
              element: <CompletedOrder />,
            },
            {
              path: seller_routes.orders_cacelled,
              element: <CancelledOrder />,
            },
            {
              path: seller_routes.orders_return,
              element: <ReturnOrder />,
            },
            {
              path: seller_routes.orders_failed_delivery,
              element: <FailedDeliveryOrder />,
            },
          ],
        },

        {
          path: seller_routes.products,
          element: <ProductsManagement />,
        },
        {
          path: seller_routes.add_product,
          element: <AddProduct />,
        },
        {
          path: seller_routes.product_banned,
          element: <BannedProduct />,
        },
        {
          path: seller_routes.product_brand,
          element: <ProductBrand />,
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
          path: seller_routes.setting_profile,
          element: <SettingProfile />,
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
