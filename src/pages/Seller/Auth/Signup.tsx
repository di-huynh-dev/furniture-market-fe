import login from '@/assets/images/login-seller.jpg'
import { FormInput, LoadingButton } from '@/components'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { RegisterSellerType } from '@/types/user.type'
import sellerAuthApi from '@/api/seller/sellerAuthApi'
import toast from 'react-hot-toast'
import authApi from '@/api/buyer/buyerAuthApi'

export type FormData = RegisterSellerType

const Sigup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Kênh người bán - Đăng ký'
    return () => {
      document.title = 'Kênh người bán - Đăng ký'
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    const userRegister = {
      shopName: data.shopName,
      ownerName: data.ownerName,
      birthday: data.birthday,
      gender: data.gender,
      email: data.email,
      phone: data.phone,
      password: data.password,
      address: '',
      deliveryMethod: '',
    }
    try {
      const resp = await sellerAuthApi.register(userRegister)

      if (resp.status === 200) {
        const otpResp = await authApi.sendOtp(userRegister.email, 'REGISTER_USER')
        setIsLoading(false)
        if (otpResp.status === 200) {
          localStorage.setItem('registeredSellerEmail', userRegister.email)
          toast.success(resp.data.messages[0])
          navigate('/seller/confirm-email')
        } else {
          toast.error('Unknown error occurred')
        }
      } else {
        // toast.error(resp?.data.messages?.[0] || 'Unknown error occurred')
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
    }
  }
  const validationSchema = yup.object({
    shopName: yup.string().required('Không được để trống!'),
    ownerName: yup.string().required('Không được để trống'),
    birthday: yup.string().required('Không được để trống'),
    gender: yup.string().required('Không được để trống'),
    email: yup.string().email('Email không hợp lệ!').required('Không được để trống'),
    phone: yup
      .string()
      .matches(/^[0-9]+$/, 'SĐT không hợp lệ')
      .required('Không được để trống'),
    password: yup.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').required('Không được để trống'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
      .required('Không được để trống'),
    checked: yup
      .bool()
      .required('Bạn chưa đồng ý với điều khoản của Fnest')
      .oneOf([true], 'Bạn cần đồng ý với điều khoản'),
  })

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
      <section className="grid lg:grid-cols-2 grid-cols-1 place-items-center align-element mt-10">
        <div className="mx-6 lg:mx-0">
          <div className="lg:my-4 my-0">
            <h3 className="md:text-2xl lg:text-2xl pb-2 font-semibold text-primary">
              Trở thành người bán ngay hôm nay
            </h3>
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card lg:w-[500px] md:w-[500px] w-[300px] p-8 bg-base-100 shadow-xl"
        >
          <h3 className="md:text-2xl lg:text-2xl pb-2 font-semibold text-center text-primary">
            Đăng ký tài khoản người bán
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              prop="email"
              type="text"
              label="Email(*)"
              register={register}
              placeholder="abc123@gmail.com"
              errorMessage={errors.email?.message}
            />
            <FormInput
              prop="shopName"
              type="text"
              label="Tên shop(*)"
              register={register}
              placeholder="Gỗ xưa shop"
              errorMessage={errors.shopName?.message}
            />
          </div>
          <FormInput
            prop="ownerName"
            type="text"
            label="Họ và tên người bán(*)"
            register={register}
            placeholder="Nguyễn Văn A"
            errorMessage={errors.ownerName?.message}
          />
          <FormInput
            prop="phone"
            type="text"
            label="Số điện thoại(*)"
            register={register}
            placeholder="0352639623"
            errorMessage={errors.phone?.message}
          />
          <div className="grid grid-cols-2 gap-4 items-end">
            <FormInput
              prop="birthday"
              type="date"
              label="Ngày sinh(*)"
              register={register}
              errorMessage={errors.birthday?.message}
            />

            <select
              {...register('gender')}
              className="select select-bordered w-full max-w-xs"
              onChange={(e) => e.target.setCustomValidity('')}
            >
              <option value="" disabled selected>
                Giới tính
              </option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
            </select>
          </div>
          <FormInput
            prop="password"
            type="password"
            label="Mật khẩu(*)"
            placeholder="Tối thiểu 8 ký tự"
            register={register}
            errorMessage={errors.password?.message}
          />
          <FormInput
            prop="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu(*)"
            placeholder="Mật khẩu xác nhận trùng với mật khẩu mới"
            register={register}
            errorMessage={errors.confirmPassword?.message}
          />
          <div className="my-2 flex items-center gap-2 text-sm text-gray-500">
            <input
              type="checkbox"
              {...register('checked', { required: true })}
              className="checkbox border-orange-400 checked:border-indigo-300 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange]"
            />
            <p>
              Tôi hoàn toàn đồng ý với những <Link to="/">Điều khoản</Link> và <Link to="/">Điều kiện</Link> của Fnest
              để trở thành người bán
            </p>
          </div>
          {errors.checked?.message && <p className="text-red-500 text-sm">{errors.checked?.message}</p>}

          <button type="submit" className="btn btn-outline btn-primary mt-4 capitalize">
            {isLoading ? <LoadingButton /> : 'Đăng ký'}
          </button>
          <div className="divider">OR</div>
          <p className="text-center p-2 text-sm">
            Bạn đã có tài khoản?
            <Link to="/seller/login" className="ml-2 link link-hover link-primary">
              Đăng nhập!
            </Link>
          </p>
        </form>
      </section>
    </>
  )
}

export default Sigup
