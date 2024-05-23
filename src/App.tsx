import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import {
  AboutHome,
  BuyerAccount,
  BuyerAddress,
  BuyerCart,
  BuyerCheckout,
  BuyerLogin,
  BuyerNotificationVoucher,
  BuyerNotificationsOrder,
  BuyerNotificationsSystem,
  BuyerOrderDetail,
  BuyerProductDetail,
  BuyerProductHome,
  BuyerProfile,
  BuyerPurchase,
  BuyerSearch,
  BuyerSignup,
  BuyerVoucher,
  BuyerWallet,
  BuyerWhishlist,
  ChatGPT,
  MallHome,
  ReviewProduct,
} from './pages/Buyer'
import {
  AddProduct,
  BannedProduct,
  ChatCenter,
  DiscountManagement,
  Feedback,
  ForgotPassword,
  IncomeManagement,
  MarketingManagement,
  NotifyManagement,
  OrdersManagement,
  PaymentAccount,
  ProductsManagement,
  ReturnOrder,
  SellerHome,
  SellerLogin,
  SellerSignup,
  Setting,
  SettingIdentify,
  SettingProfile,
  SettingShop,
  SettingVAT,
  ShopCategory,
  ShopError,
  ShopHome,
  ShopManagement,
  UpdateProduct,
} from './pages/Seller'

import { buyer_routes, common_routes, seller_routes } from './constants/routes-link'
import { BuyerProtected, SellerProtected } from './components'
import Error from './pages/Error/Error'
import HomeLayout from './pages/HomeLayout'
import ConfirmEmail from './pages/Common/ConfirmEmail'
import VnPayReturn from './pages/Common/VnPayReturn'
import ConfirmResetPassword from './pages/Common/ConfirmResetPassword'

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
          element: (
            <BuyerProtected>
              <BuyerAccount />
            </BuyerProtected>
          ),
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
              path: buyer_routes.review_product,
              element: <ReviewProduct />,
            },
            {
              path: buyer_routes.address,
              element: <BuyerAddress />,
            },
            {
              path: buyer_routes.wallet,
              element: <BuyerWallet />,
            },
            {
              path: buyer_routes.voucher,
              element: <BuyerVoucher />,
            },
            {
              path: buyer_routes.notifications_order,
              element: <BuyerNotificationsOrder />,
            },
            {
              path: buyer_routes.notifications_account,
              element: <BuyerNotificationsSystem />,
            },
            {
              path: buyer_routes.notifications_voucher,
              element: <BuyerNotificationVoucher />,
            },
          ],
        },
        {
          path: buyer_routes.cart,
          element: <BuyerCart />,
        },
        {
          path: buyer_routes.chat_gpt,
          element: <ChatGPT />,
        },
        {
          path: buyer_routes.search,
          element: <BuyerSearch />,
        },
        {
          path: common_routes.vnpay_return,
          element: <VnPayReturn />,
        },
        {
          path: buyer_routes.checkout,
          element: (
            <BuyerProtected>
              <BuyerCheckout />
            </BuyerProtected>
          ),
        },
        {
          path: buyer_routes.products,
          element: <BuyerProductHome />,
        },
        {
          path: buyer_routes.product_detail,
          element: <BuyerProductDetail />,
        },
        {
          path: buyer_routes.whishlist,
          element: (
            <BuyerProtected>
              <BuyerWhishlist />
            </BuyerProtected>
          ),
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
        {
          path: buyer_routes.shop_home,
          element: <ShopHome />,
          errorElement: <ShopError />,
        },
        {
          path: buyer_routes.mall,
          element: <MallHome />,
        },
        {
          path: buyer_routes.about,
          element: <AboutHome />,
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
      path: seller_routes.forgot_password,
      element: <ForgotPassword />,
    },
    {
      path: seller_routes.confirm_email,
      element: <ConfirmEmail />,
    },
    {
      path: seller_routes.confirm_reset_password,
      element: <ConfirmResetPassword />,
    },
    {
      path: seller_routes.seller,
      element: <SellerProtected />,
      children: [
        { index: true, element: <SellerHome /> },
        {
          path: seller_routes.orders,
          element: <OrdersManagement />,
          children: [
            {
              path: seller_routes.orders_return,
              element: <ReturnOrder />,
            },
          ],
        },
        {
          path: seller_routes.shop_cagory,
          element: <ShopCategory />,
        },
        {
          path: seller_routes.settings,
          element: <Setting />,
          children: [
            { path: seller_routes.setting_shop, element: <SettingShop /> },
            { path: seller_routes.setting_profile, element: <SettingProfile /> },
            { path: seller_routes.setting_identify, element: <SettingIdentify /> },
            { path: seller_routes.setting_vat, element: <SettingVAT /> },
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
          path: seller_routes.update_product,
          element: <UpdateProduct />,
        },
        {
          path: seller_routes.chat,
          element: <ChatCenter />,
        },
        {
          path: seller_routes.product_banned,
          element: <BannedProduct />,
        },
        {
          path: seller_routes.marketing,
          element: <MarketingManagement />,
        },
        {
          path: seller_routes.discount_marketing,
          element: <DiscountManagement />,
        },
        {
          path: seller_routes.income,
          element: <IncomeManagement />,
        },
        {
          path: seller_routes.payment_account,
          element: <PaymentAccount />,
        },
        {
          path: seller_routes.feedback,
          element: <Feedback />,
        },
        {
          path: seller_routes.shop,
          element: <ShopManagement />,
        },
        {
          path: seller_routes.notify,
          element: <NotifyManagement />,
        },
      ],
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
