import login from '@/assets/images/login-seller.jpg'
import { FormInput } from '@/components'
import { Form, Link } from 'react-router-dom'
const Sigup = () => {
  return (
    <section className="grid lg:grid-cols-2 grid-cols-1 place-items-center align-element">
      <div className="mx-6 lg:mx-0">
        <div className="lg:my-4 my-0">
          <h3 className="md:text-2xl lg:text-2xl pb-2 font-semibold text-primary">Trở thành người bán ngay hôm nay</h3>
          <h3 className="text-gray-500">Đăng ký bán hàng đơn giản chỉ với vài thao tác đơn giản và nhanh chóng</h3>
        </div>
        <img src={login} alt="Ảnh login" />
        <div>
          <ul className="steps gap-4 text-gray-500">
            <li className="step step-primary">Đăng ký tài khoản</li>
            <li className="step step-primary">Thiết lập thông tin</li>
            <li className="step step-primary">Cài đặt vận chuyển</li>
            <li className="step step-primary">Đăng bán sản phẩm</li>
          </ul>
        </div>
      </div>
      <Form className="card lg:w-[500px] md:w-[500px] w-[300px] p-8 bg-base-100 shadow-xl">
        <h3 className="md:text-2xl lg:text-3xl pb-2 font-semibold text-center text-primary">
          Đăng ký tài khoản người bán
        </h3>
        <FormInput type="text" label="Email(*)" name="email" value="" placeholder="Email" />
        <FormInput type="text" label="Họ và tên(*)" name="name" value="" placeholder="Họ và tên" />
        <div className="grid gap-2">
          <div className="grid grid-flow-col">
            <FormInput type="date" label="Ngày sinh(*)" name="email" value="" />
          </div>
        </div>
        <FormInput type="password" label="Mật khẩu(*)" name="password" value="" placeholder="Mật khẩu" />
        <FormInput type="password" label="Mật khẩu xác nhận(*)" name="password" value="" placeholder="Mật khẩu" />
        <button className="btn btn-outline btn-primary mt-4">Đăng ký</button>
        <div className="divider">OR</div>
        <p className="text-center p-2 text-sm">
          Bạn đã có tài khoản?
          <Link to="/seller/login" className="ml-2 link link-hover link-primary">
            Đăng nhập!
          </Link>
        </p>
      </Form>
    </section>
  )
}

export default Sigup
