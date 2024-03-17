import { RiBillLine } from 'react-icons/ri'
import { BsCashStack } from 'react-icons/bs'
import { LiaShippingFastSolid } from 'react-icons/lia'
import { FaPeopleCarryBox } from 'react-icons/fa6'
import { FaRegStar } from 'react-icons/fa'

const BuyerOrderDetail = () => {
  return (
    <div className="mx-4 my-2">
      <div className="border-b-2 pb-5 lg:text-lg text-sm">
        <div className="flex justify-between">
          <div className="font-bold capitalize">Thông tin chi tiết đơn hàng</div>
          <div className="text-gray-500 text-sm">Mã đơn hàng:213124AADS</div>
        </div>
      </div>
      <div>
        <ul className="timeline timeline-vertical lg:timeline-horizontal">
          <li>
            <div className="timeline-start text-sm text-gray-500">14:21 21-21-2023</div>
            <div className="timeline-middle text-primary">
              <RiBillLine className="w-10 h-10" />
            </div>
            <div className="timeline-end timeline-box">Đơn hàng đã đặt</div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-start text-sm text-gray-500">13:11 26-12-2023</div>
            <div className="timeline-middle text-primary">
              <BsCashStack className="w-10 h-10" />
            </div>
            <div className="timeline-end timeline-box">Đã thanh toán</div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-start text-sm text-gray-500">5:12 12-12-2023</div>
            <div className="timeline-middle text-primary">
              <LiaShippingFastSolid className="w-10 h-10" />
            </div>
            <div className="timeline-end timeline-box">Đã giao cho đơn vị vận chuyển</div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-start text-sm text-gray-500">16:23 14-12-2023</div>
            <div className="timeline-middle text-primary">
              <FaPeopleCarryBox className="w-10 h-10" />
            </div>
            <div className="timeline-end timeline-box">Đã nhận</div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-start text-sm text-gray-500">12:11 12-12-2023</div>
            <div className="timeline-middle text-primary">
              <FaRegStar className="w-10 h-10" />
            </div>
            <div className="timeline-end timeline-box">Hoàn thành</div>
          </li>
        </ul>
      </div>
      <div className="divider divider-start divider-success text-sm">Chi tiết đơn hàng</div>
      <div>
        <div className="text-sm m-2">
          <p className="text-lg">Địa chỉ nhận hàng</p>
          <p>Họ và tên người nhận: Huỳnh Tiến Dĩ</p>
          <p>SDT người nhận: 0987654321</p>
          <p>
            Đ/c: Trà Chanh Tmore Đường 449 lê văn việt , phường Tăng Nhơn Phú A , Quận 9, Phường Tăng Nhơn Phú A, Thành
            Phố Thủ Đức, TP. Hồ Chí Minh
          </p>
        </div>
        <div className="m-2">
          <p className="text-lg">Danh sách sản phẩm</p>
          <div className="my-2">
            <div className="grid grid-cols-5 gap-2">
              <div className="flex items-center justify-center">
                <figure>
                  <img
                    src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                    alt="Movie"
                    className="h-20 w-20"
                  />
                </figure>
              </div>
              <div className="col-span-4">
                <h2 className="text-lg">Bàn ăn 8 chỗ Coastal</h2>
                <div className="text-sm text-gray-500">
                  <p>Vật liệu: Gỗ Ash - MDF veneer Ash</p>
                  <p>Size: D2000 - R1000 - C750 mm</p>
                  <div className="flex justify-between">
                    <p>Số lượng: 2</p>
                    <div className="flex gap-2">
                      <span className="text-primary">2300000</span>
                      <span className="line-through text-gray-400">2300000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-2">
            <div className="grid grid-cols-5 gap-2">
              <div className="flex items-center justify-center">
                <figure>
                  <img
                    src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                    alt="Movie"
                    className="h-20 w-20"
                  />
                </figure>
              </div>
              <div className="col-span-4">
                <h2 className="text-lg">Bàn ăn 8 chỗ Coastal</h2>
                <div className="text-sm text-gray-500">
                  <p>Vật liệu: Gỗ Ash - MDF veneer Ash</p>
                  <p>Size: D2000 - R1000 - C750 mm</p>
                  <div className="flex justify-between">
                    <p>Số lượng: 2</p>
                    <div className="flex gap-2">
                      <span className="text-primary">2300000</span>
                      <span className="line-through text-gray-400">2300000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-2">
            <div className="grid grid-cols-5 gap-2">
              <div className="flex items-center justify-center">
                <figure>
                  <img
                    src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                    alt="Movie"
                    className="h-20 w-20"
                  />
                </figure>
              </div>
              <div className="col-span-4">
                <h2 className="text-lg">Bàn ăn 8 chỗ Coastal</h2>
                <div className="text-sm text-gray-500">
                  <p>Vật liệu: Gỗ Ash - MDF veneer Ash</p>
                  <p>Size: D2000 - R1000 - C750 mm</p>
                  <div className="flex justify-between">
                    <p>Số lượng: 2</p>
                    <div className="flex gap-2">
                      <span className="text-primary">2300000</span>
                      <span className="line-through text-gray-400">2300000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="divider divider-start divider-info text-sm">Hoá đơn</div>
        <div>
          <div>
            <p>Tổng tiền: 2.300.000đ</p>
            <p>Phí vận chuyển: 234.123.123đ</p>
            <p>Mã giảm giá: XUANAMNO</p>
            <p>Số tiền giảm: 200.000đ</p>
            <p>Phương thức thanh toán: Ví momo</p>
            <p className="text-primary text-xl font-bold">Thành tiền: 2.100.000đ</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerOrderDetail
