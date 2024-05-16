import { Link, Outlet } from 'react-router-dom'
import { CiReceipt, CiBookmarkCheck, CiShop, CiBank, CiChat2, CiMoneyCheck1 } from 'react-icons/ci'

const DrawerSide = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <Outlet />

        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open drawer
        </label>
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-white w-56 rounded-box">
          <li>
            <details open>
              <summary className="font-bold text-neutral">
                <CiBank className="w-6 h-6" />
                Quản lý hàng hóa
              </summary>
              <ul>
                <li className="text-gray-500">
                  <Link to={'category'}>Danh mục hàng</Link>
                  <Link to={'/seller/products'}>Tất cả</Link>
                  <Link to={'products/new'}>Thêm sản phẩm</Link>
                  <Link to={'products/banned'}>Sản phẩm vi phạm</Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details open>
              <summary className="font-bold text-neutral">
                <CiReceipt className="w-6 h-6" />
                Quản lý đơn hàng
              </summary>
              <ul>
                <li className="text-gray-500">
                  <Link to={'/seller/orders'}>Tất cả</Link>
                  <a>Trả hàng/hoàn tiền</a>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <details open>
              <summary className="font-bold text-neutral">
                <CiMoneyCheck1 className="w-6 h-6" />
                Quản lý tài chính
              </summary>
              <ul>
                <li className="text-gray-500">
                  <Link to={'income'}>Doanh thu</Link>
                  <Link to={'income/payment-account'}>Số dư tài khoản</Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details open>
              <summary className="font-bold text-neutral">
                <CiChat2 className="w-6 h-6" />
                Chăm sóc khách hàng
              </summary>
              <ul>
                <li className="text-gray-500">
                  <Link to={'chat'}>Kênh chat</Link>
                  <Link to={'feedback'}>Quản lý Feedback</Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details open>
              <summary className="font-bold text-neutral">
                <CiBookmarkCheck className="w-6 h-6" />
                Kênh marketing
              </summary>
              <ul>
                <li className="text-gray-500">
                  <Link to={'marketing'}>Quảng cáo Fnest</Link>
                  <Link to={'marketing/discount'}>Khuyến mãi của shop</Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details open>
              <summary className="font-bold text-neutral">
                <CiShop className="w-6 h-6" />
                Quản lý shop
              </summary>
              <ul>
                <li className="text-gray-500">
                  <Link to={'settings/profile'}>Hồ sơ</Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default DrawerSide
