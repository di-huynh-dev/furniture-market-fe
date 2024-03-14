import login from '@/assets/images/login.jpg'
import { FormInput } from '@/components'
import { FcGoogle } from 'react-icons/fc'
import { Form, Link } from 'react-router-dom'
const Login = () => {
  return (
    <section className="my-10 grid lg:grid-cols-2 grid-cols-1 place-items-center align-element">
      <div className="mx-6 lg:mx-0">
        <img src={login} alt="Ảnh login" />
      </div>
      <Form className="card lg:w-[500px] md:w-[500px] w-[300px] p-8 bg-base-100 shadow-xl">
        <h3 className="md:text-2xl lg:text-2xl pb-2 font-semibold text-center text-primary">
          Chào mừng bạn đến với <br /> Nội thất Fnest!
        </h3>
        <p className="md:text-xl lg:text-xl text-sm font-bold text-center">Đăng nhập bằng tài khoản của bạn</p>
        <FormInput
          type="text"
          label="Tên đăng nhập(*)"
          name="email"
          value=""
          placeholder="Email/Số điện thoại/Tên đăng nhập"
        />
        <FormInput type="password" label="Mật khẩu(*)" name="password" value="" placeholder="Mật khẩu" />
        <button className="btn btn-outline btn-primary mt-4">Đăng nhập</button>
        <p className="text-left text-sm text-primary p-2">
          <Link to="/forgot-password" className="">
            Quên mật khẩu?
          </Link>
        </p>
        <div className="divider">OR</div>
        <Link to="https://fnest-store.api.codeforlife.blog/oauth2/authorization/google">
          <div className="btn btn-ghost flex justify-center w-full items-center text-center">
            <FcGoogle className="w-12 h-12 text-primary" />
            <p className="hidden md:block lg:block"> Đăng nhập bằng Google</p>
          </div>
        </Link>
        <div className="flex items-center justify-center text-center my-4 text-sm">
          <p> Bạn mới biết đến Fnest?</p>
          <Link to="/buyer/signup" className="ml-2 link link-hover link-primary">
            Đăng ký ngay!
          </Link>
        </div>
      </Form>
    </section>
  )
}

export default Login
