import signup from '@/assets/images/login.jpg'
import { FormInput } from '@/components'
import { Form, Link } from 'react-router-dom'
const Signup = () => {
  return (
    <section className="my-10 grid lg:grid-cols-2 grid-cols-1 place-items-center align-element">
      <div className="mx-6 lg:mx-0">
        <img src={signup} alt="Ảnh login" />
      </div>
      <Form className="card lg:w-[500px] md:w-[500px] w-[300px] p-8 bg-base-100 shadow-xl">
        <h3 className="md:text-2xl lg:text-2xl pb-2 font-semibold text-center text-primary">Đăng ký tài khoản Fnest</h3>
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
          <Link to="/buyer/login" className="ml-2 link link-hover link-primary">
            Đăng nhập!
          </Link>
        </p>
      </Form>
    </section>
  )
}

export default Signup
