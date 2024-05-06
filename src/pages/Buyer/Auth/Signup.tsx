import signup from '@/assets/images/login.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { RegisterType } from '@/types/user.type'
import { FormInput, LoadingButton } from '@/components'
import authApi from '@/api/buyer/buyerAuthApi'
import { toast } from 'react-toastify'
import { useState } from 'react'

export type FormData = RegisterType

const Signup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    const userRegister = {
      email: data.email,
      phone: data.phone,
      birthday: data.birthday,
      password: data.password,
      fullName: data.fullName,
      gender: data.gender,
    }
    try {
      const resp = await authApi.register(userRegister)
      if (resp.status === 200) {
        const otpResp = await authApi.sendOtp(userRegister.email, 'REGISTER_USER')
        setIsLoading(false)

        if (otpResp.status === 200) {
          localStorage.setItem('registeredBuyerEmail', userRegister.email)
          toast.success(resp.data.messages[0])
          navigate('/buyer/confirm-email')
        } else {
          toast.error('Unknown error occurred')
        }
      } else {
        toast.error(resp?.data.messages?.[0] || 'Unknown error occurred')
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      toast.error('Error Api called')
    }
  }

  const validationSchema = yup.object({
    email: yup.string().email('Email không hợp lệ!').required('Không được để trống'),
    phone: yup
      .string()
      .matches(/^[0-9]+$/, 'SĐT không hợp lệ')
      .required('Không được để trống'),
    birthday: yup.string().required('Không được để trống'),
    password: yup.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').required('Không được để trống'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
      .required('Không được để trống'),
    fullName: yup.string().required('Không được để trống'),
    gender: yup.string().required('Không được để trống'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  })

  return (
    <section className="my-10 grid lg:grid-cols-2 grid-cols-1 place-items-center align-element">
      <div className="mx-6 lg:mx-0">
        <img src={signup} alt="Ảnh login" />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card lg:w-[500px] md:w-[500px] w-[300px] p-8 bg-base-100 shadow-xl"
      >
        <h3 className="md:text-2xl lg:text-2xl pb-2 font-semibold text-center text-primary">Đăng ký tài khoản Fnest</h3>
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
            prop="fullName"
            type="text"
            label="Họ và tên(*)"
            register={register}
            placeholder="Nguyễn Văn A"
            errorMessage={errors.fullName?.message}
          />
        </div>
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
            <option value="OTHER">Khác</option>
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
        <button type="submit" className="btn btn-outline btn-primary mt-4 capitalize">
          {isLoading ? <LoadingButton /> : 'Đăng ký'}
        </button>
        <div className="divider">OR</div>
        <p className="text-center p-2 text-sm">
          Bạn đã có tài khoản?
          <Link to="/buyer/login" className="ml-2 link link-hover link-primary">
            Đăng nhập!
          </Link>
        </p>
      </form>
    </section>
  )
}

export default Signup
