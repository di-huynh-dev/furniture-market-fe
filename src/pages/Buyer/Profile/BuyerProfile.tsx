import { FormInput } from '@/components'
import { CiCircleCheck } from 'react-icons/ci'

const BuyerProfile = () => {
  return (
    <div className="mx-4 my-2">
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Thay đổi thông tin cá nhân</h3>
          <div className="grid grid-cols-2 gap-2">
            <FormInput type="text" label="Họ và tên" name="name" value="" placeholder="Nguyễn Văn A" />
            <FormInput type="text" label="Số điện thoại" name="phone" value="" placeholder="0351232345" />
            <FormInput type="email" label="Email" name="email" value="" placeholder="nguyenvan@gmail.com" />
            <FormInput type="date" label="Ngày sinh" name="birthday" value="" placeholder="Thôn Trung Bình..." />
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
        <div className="font-bold capitalize">Thông tin cá nhân</div>
        <div className="text-gray-500 text-sm">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <tbody>
            <tr>
              <td>Tên đăng nhập</td>
              <td>dihuynh123</td>
            </tr>
            <tr>
              <td>Họ và tên</td>
              <td>Huỳnh Tiến Dĩ</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>
                <div className="flex items-center gap-2">
                  <span> phand613@gmail.com</span> <CiCircleCheck className="text-success font-bold w-10 h-10" />
                </div>
              </td>
            </tr>
            <tr>
              <td>Số điện thoại</td>
              <td>0372639623</td>
            </tr>
            <tr>
              <td>Ngày sinh</td>
              <td>18/01/2002</td>
            </tr>
            <tr>
              <td>Giới tính</td>
              <td>Nam</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-center">
          <a href="#my_modal_8" className="btn btn-sm">
            Thay đổi thông tin
          </a>
        </div>
      </div>
    </div>
  )
}

export default BuyerProfile
