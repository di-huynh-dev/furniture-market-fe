import { FormInput } from '@/components'
import { Form } from 'react-router-dom'

const BuyerPassword = () => {
  return (
    <div className="mx-4 my-2">
      <div className="border-b-2 pb-5 lg:text-lg text-sm">
        <div className="grid md:grid-cols-2">
          <div>
            <div className="font-bold capitalize">Thay đổi mật khẩu</div>
            <div className="text-gray-500 text-sm">Đổi mật khẩu của tài khoản cá nhân</div>
          </div>
        </div>
      </div>

      <Form>
        <FormInput
          type="password"
          label="Mật khẩu cũ"
          name="old_password"
          value=""
          placeholder="Vui lòng nhập mật khẩu cũ"
        />
        <FormInput
          type="password"
          label="Mật khẩu mới"
          name="new_password"
          value=""
          placeholder="Vui lòng nhập mật khẩu mới"
        />
        <FormInput
          type="password"
          label="Mật khẩu xác nhận"
          name="new_password"
          value=""
          placeholder="Vui lòng nhập mật xác nhận"
        />
        <button className="btn btn-outline btn-primary mt-4">Lưu thay đổi</button>
      </Form>
    </div>
  )
}

export default BuyerPassword
