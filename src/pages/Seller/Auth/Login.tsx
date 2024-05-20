/* eslint-disable @typescript-eslint/no-explicit-any */
import login from '@/assets/images/login-seller.jpg'
import { FormInput, LoadingButton } from '@/components'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { LoginApiType } from '@/types/user.type'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import commonApi from '@/api/commonApi'
import toast from 'react-hot-toast'
import { addAuth } from '@/redux/reducers/seller/sellerAuthSlice'

export type FormData = LoginApiType

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    document.title = 'Kênh người bán - Đăng nhập'
  }, [])

  const validationSchema = yup.object({
    email: yup.string().email('Email không hợp lệ!').required('Không được để trống'),
    password: yup.string().required('Không được để trống'),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    const userLogin = {
      email: data.email,
      password: data.password,
    }
    try {
      const resp = await commonApi.loginSeller(userLogin)

      if (resp.status === 200 && resp.data.data.user.role === 'SELLER') {
        setIsLoading(false)
        // localStorage.setItem('accessToken', resp.data.data.accessToken)
        dispatch(addAuth(resp.data.data))
        toast.success('Đăng nhập thành công')
        navigate('/seller')
      } else {
        setIsLoading(false)
        toast.error('Tài khoản không tồn tại!')
      }
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.response.data.messages[0])
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  })
  return (
    <>
      <div className="navbar bg-base-10 shadow-lg">
        <Link to="/" className="btn btn-ghost text-xl text-primary">
          Trang chủ Fnest
        </Link>
        <p>Hệ thống quản lý Kênh người bán</p>
      </div>
      <section className="h-screen grid lg:grid-cols-2 grid-cols-1 place-items-center align-element">
        <div className="mx-6 lg:mx-0">
          <div className="my-4">
            <h3 className="md:text-2xl lg:text-2xl pb-2 font-semibold text-primary">
              Bán hàng chuyên nghiệp cùng Nội thất Fnest
            </h3>
            <h3 className="text-gray-500">
              Quản lý shop của bạn một cách hiệu quả hơn trên hệ thống với Kênh Người bán
            </h3>
          </div>
          <img src={login} alt="Ảnh login" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card lg:w-[500px] md:w-[500px] w-[300px] p-8 bg-base-100 shadow-xl"
        >
          <h3 className="md:text-2xl lg:text-2xl pb-2 font-semibold text-center text-primary">
            Đăng nhập tài khoản người bán
          </h3>
          <FormInput
            prop="email"
            type="text"
            label="Email(*)"
            register={register}
            placeholder="abc123@gmail.com"
            errorMessage={errors.email?.message}
          />
          <FormInput
            prop="password"
            type="password"
            label="Mật khẩu(*)"
            placeholder="Mật khẩu của bạn"
            register={register}
            errorMessage={errors.password?.message}
          />
          <button type="submit" className="btn btn-outline btn-primary mt-4 capitalize">
            {isLoading ? <LoadingButton /> : 'Đăng nhập'}
          </button>
          <p className="text-left text-sm text-primary p-2">
            <Link to="/seller/forgot-password" className="">
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
            <p> Bạn muốn trở thành người bán?</p>
            <Link to="/seller/signup" className="ml-2 link link-hover link-primary">
              Đăng ký ngay!
            </Link>
          </div>
        </form>
      </section>
    </>
  )
}

export default Login
