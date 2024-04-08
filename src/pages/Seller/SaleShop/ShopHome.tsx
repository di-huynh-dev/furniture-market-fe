import { CiShoppingBasket, CiChat1, CiStar, CiTimer } from 'react-icons/ci'
import { FiUserPlus } from 'react-icons/fi'
import { PiUsersFourThin } from 'react-icons/pi'

const ShopHome = () => {
  const gridItems = [
    { icon: CiShoppingBasket, label: 'Tổng sản phẩm', value: 123 },
    { icon: FiUserPlus, label: 'Đang theo dõi', value: 123 },
    { icon: CiChat1, label: 'Tỉ lệ phản hồi chat', value: 123 },
    { icon: PiUsersFourThin, label: 'Người theo dõi', value: 123 },
    { icon: CiStar, label: 'Điểm đánh giá', value: 123 },
    { icon: CiTimer, label: 'Đã tham gia', value: 123 },
  ]

  return (
    <div>
      <div className=" bg-white shadow-md">
        <div className="align-element my-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="flex items-center gap-2 ">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXydxtyfaTut_cRdX84BpIHmGs48UJpJTnio_KBNA-CA&s"
                  alt=""
                  className="rounded-full w-32 h-32"
                />
                <div className="">
                  <p className="text-lg font-bold">L'Oreal Paris Official Store</p>
                  <p>Online 21 phút trước</p>
                </div>
              </div>
              <div className="flex gap-2 my-2">
                <button className="btn btn-sm btn-outline">+ Theo dõi</button>
                <button className="btn btn-sm btn-outline">Chat</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 col-span-2">
              {gridItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-6 h-6 text-primary" />}
                  <span>
                    {item.label}: <span className="text-primary">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div role="tablist" className="tabs tabs-lifted">
            <a role="tab" className="tab   tab-active text-primary [--tab-border-color:orange]">
              Tất cả
            </a>
            <a role="tab" className="tab ">
              Bàn gỗ
            </a>
            <a role="tab" className="tab">
              Ghế tựa
            </a>
            <a role="tab" className="tab ">
              Bàn gỗ
            </a>
            <a role="tab" className="tab">
              Ghế tựa
            </a>
            <a role="tab" className="tab ">
              Bàn gỗ
            </a>
            <a role="tab" className="tab">
              Ghế tựa
            </a>
          </div>
        </div>
      </div>
      <div className="align-element bg-white shawdow-md my-10">
        <div className="p-10">
          <p>VOUCHER CỦA SHOP</p>
          <div className="grid grid-cols-3 gap-4">
            <div className=" max-w-sm bg-orange-100 border-2 border-gray-300 border-dashed ">
              <div className="p-4 grid grid-cols-3 items-center">
                <div className="col-span-2">
                  <p>Giảm giá 10k</p>
                  <p>Đơn tối thiểu 199k</p>
                  <p className="text-sm">HSD: 31.04.2022</p>
                </div>
                <button className="btn btn-sm btn-primary text-white">Lưu</button>
              </div>
            </div>
            <div className=" max-w-sm bg-orange-100 border-2 border-gray-300 border-dashed ">
              <div className="p-4 grid grid-cols-3 items-center">
                <div className="col-span-2">
                  <p>Giảm giá 10k</p>
                  <p>Đơn tối thiểu 199k</p>
                  <p className="text-sm">HSD: 31.04.2022</p>
                </div>
                <button className="btn btn-sm btn-primary text-white">Lưu</button>
              </div>
            </div>
            <div className=" max-w-sm bg-orange-100 border-2 border-gray-300 border-dashed ">
              <div className="p-4 grid grid-cols-3 items-center">
                <div className="col-span-2">
                  <p>Giảm giá 10k</p>
                  <p>Đơn tối thiểu 199k</p>
                  <p className="text-sm">HSD: 31.04.2022</p>
                </div>
                <button className="btn btn-sm btn-primary text-white">Lưu</button>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>

      <div className="align-element bg-white shawdow-md">
        <div className="p-10">
          <p>Danh sách sản phẩm</p>
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default ShopHome
