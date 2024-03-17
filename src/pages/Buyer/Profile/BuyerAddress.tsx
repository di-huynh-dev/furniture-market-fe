import { FormInput } from '@/components'
import { BiPlus } from 'react-icons/bi'

const BuyerAddress = () => {
  return (
    <div className="mx-4 my-2">
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Thêm địa chỉ mới</h3>
          <div className="grid grid-cols-2 gap-2">
            <FormInput type="text" label="Họ và tên" name="name" value="" placeholder="Nguyễn Văn A" />
            <FormInput type="text" label="Số điện thoại" name="phone" value="" placeholder="0351232345" />
            <select className="select select-bordered w-full max-w-xs">
              <option disabled selected>
                Tỉnh/thành phố?
              </option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>
            <select className="select select-bordered w-full max-w-xs">
              <option disabled selected>
                Quận/huyện?
              </option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>
            <select className="select select-bordered w-full max-w-xs">
              <option disabled selected>
                Phường/xã?
              </option>
              <option>Han Solo</option>
              <option>Greedo</option>
            </select>
          </div>
          <div>
            <FormInput type="text" label="Chi tiết" name="detail" value="" placeholder="Thôn Trung Bình..." />
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Đặt làm mặc định</span>
              <input type="checkbox" defaultChecked className="checkbox" />
            </label>
          </div>
          <div className="modal-action">
            <a href="#" className="btn">
              Đóng
            </a>
            <button className="btn btn-primary text-white">Lưu</button>
          </div>
        </div>
      </div>
      <div className="border-b-2 pb-5 lg:text-lg text-sm">
        <div className="grid md:grid-cols-2">
          <div>
            <div className="font-bold capitalize">Địa chỉ của tôi</div>
            <div className="text-gray-500 text-sm">Thông tin về địa chỉ nhận hàng và trả hàng</div>
          </div>
          <div className="flex justify-end">
            <a href="#my_modal_8" className="btn btn-outline btn-primary  btn-sm lg:btn-md">
              <BiPlus /> Thêm địa chỉ mới
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className="grid h-30 card rounded-box space-y-2 lg:text-base text-sm">
          <div className="flex justify-between">
            <div>
              <span>Huỳnh Tiến Dĩ | 0372639623</span>
            </div>
            <div>
              <a className="link link-primary">Cập nhật</a>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <span className="text-gray-500">
                Trà Chanh Tmore Đường 449 lê văn việt , phường Tăng Nhơn Phú A , Quận 9 Phường Tăng Nhơn Phú A, Thành
                Phố Thủ Đức, TP. Hồ Chí Minh
              </span>
            </div>
            <div className="flex justify-end">
              <a className="link link-primary">Xóa</a>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <span>
              <span className="text-primary">Mặc định</span>
            </span>
          </div>
        </div>
        <div className="divider"></div>
        <div className="grid h-30 card rounded-box space-y-2">
          <div className="flex justify-between">
            <div>
              <span>Huỳnh Tiến Dĩ | 0372639623</span>
            </div>
            <div>
              <a className="link link-primary">Cập nhật</a>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <span className="text-gray-500">
                Trà Chanh Tmore Đường 449 lê văn việt , phường Tăng Nhơn Phú A , Quận 9 Phường Tăng Nhơn Phú A, Thành
                Phố Thủ Đức, TP. Hồ Chí Minh
              </span>
            </div>
            <div className="flex justify-end">
              <a className="link link-primary">Xóa</a>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <span>
              <span className="text-primary">Thiết lập mặc định</span>
            </span>
          </div>
          <div className="divider"></div>
        </div>
      </div>
    </div>
  )
}

export default BuyerAddress
