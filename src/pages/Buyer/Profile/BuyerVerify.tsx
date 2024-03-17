import verify from '@/assets/images/verify.jpg'
import { FormInput } from '@/components'

const BuyerVerify = () => {
  return (
    <div className="mx-4 my-2">
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Mã xác thực</h3>
          <div className="grid grid-cols-2 gap-2"></div>
          <FormInput type="text" label="Nhập mã xác thực" name="code" value="" placeholder="2934"></FormInput>
          <div className="modal-action">
            <a href="#" className="btn">
              Đóng
            </a>
            <button className="btn btn-primary text-white">Xác nhận</button>
          </div>
        </div>
      </div>
      <div className="border-b-2 pb-5 lg:text-lg text-sm">
        <div className="grid md:grid-cols-2">
          <div>
            <div className="font-bold capitalize">Xác nhận tài khoản thông qua email</div>
            <div className="text-gray-500 text-sm">
              Xác nhận thông tin tài khoản để tiến hành mua sắm một cách hợp lệ
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1">
          <img src={verify} alt="Verify account images" />
          <div className="flex flex-col justify-center">
            <p className="text-center">
              Chúng tôi sẽ tiến hành xác thực tài khoản của bạn bằng cách gửi mã OTP về địa chỉ email. Hãy điền mã xác
              thực để xác thực thông tin tài khoản. Mã có hiệu lực trong vòng 5 phút
            </p>
            <a href="#my_modal_8" className="btn btn-primary btn-outline uppercase">
              Nhận mã xác thực
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerVerify
