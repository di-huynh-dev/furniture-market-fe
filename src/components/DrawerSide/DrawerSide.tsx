import { Link, Outlet } from 'react-router-dom'
import { CiReceipt, CiBookmarkCheck, CiShop, CiSettings } from 'react-icons/ci'
import { MdOutlineTableRestaurant } from 'react-icons/md'

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
              <summary className="font-bold text-gray-500">
                <CiReceipt />
                Quản lý đơn hàng
              </summary>
              <ul>
                <li className="text-gray-500">
                  <Link to={'/seller/orders'}>Tất cả</Link>
                  <a>Đơn hủy</a>
                  <a>Trả hàng/hoàn tiền</a>
                  <a>Cài đặt vận chuyển</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details open>
              <summary className="font-bold text-gray-500">
                <MdOutlineTableRestaurant />
                Quản lý sản phẩm
              </summary>
              <ul>
                <li className="text-gray-500">
                  <Link to={'/seller/products'}>Tất cả</Link>
                  <Link to={'products/new'}>Thêm sản phẩm</Link>
                  <Link to={'products/banned'}>Sản phẩm vi phạm</Link>
                  <Link to={'products/brand'}>Cài đặt sản phẩm</Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details open>
              <summary className="font-bold text-gray-500">
                <CiBookmarkCheck />
                Kênh marketing
              </summary>
              <ul>
                <li className="text-gray-500">
                  <a>Quảng cáo Fnest</a>
                  <Link to={'marketing/discount'}>Khuyến mãi của shop</Link>
                  <a>Flash sale</a>
                  <a>Chương trình</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details>
              <summary className="font-bold text-gray-500">
                <CiShop />
                Quản lý shop
              </summary>
              <ul>
                <li className="text-gray-500">
                  <a>Đánh giá</a>
                  <a>Hồ sơ</a>
                  <Link to={'category'}>Danh mục hàng</Link>
                  <a>Chương trình</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <details>
              <summary className="font-bold text-gray-500">
                <CiSettings />
                Thiết lập shop
              </summary>
              <ul>
                <li className="text-gray-500">
                  <a>Địa chỉ</a>
                  <Link to={'settings/profile'}>Tài khoản</Link>
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
