/* eslint-disable @typescript-eslint/no-explicit-any */
// import login from '@/assets/images/login.jpg'
// import { FcGoogle } from 'react-icons/fc'
// import { Link, useNavigate, useSearchParams } from 'react-router-dom'
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'
// import { useForm } from 'react-hook-form'
// import { useEffect, useState } from 'react'
// import { LoginApiType } from '@/types/user.type'
// import { FormInput, LoadingButton } from '@/components'
// import commonApi from '@/api/commonApi'
// import { useDispatch } from 'react-redux'
// import { addAuth, setRefreshToken, setToken, updateProfile } from '@/redux/reducers/authSlice'
// import toast from 'react-hot-toast'
// import axiosClient from '@/libs/axios-client'

// export type FormData = LoginApiType

// const Login = () => {
//   const [isLoading, setIsLoading] = useState(false)
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const validationSchema = yup.object({
//     email: yup.string().email('Email không hợp lệ!').required('Không được để trống'),
//     password: yup.string().required('Không được để trống'),
//   })

//   const onSubmit = async (data: FormData) => {
//     setIsLoading(true)
//     const userLogin = {
//       email: data.email,
//       password: data.password,
//     }
//     try {
//       const resp = await commonApi.loginBuyer(userLogin)
//       if (resp.status === 200) {
//         setIsLoading(false)
//         dispatch(addAuth(resp.data.data))
//         toast.success('Đăng nhập thành công')
//         navigate('/')
//       } else {
//         toast.error('Đăng nhập thất bại')
//       }
//       setIsLoading(false)
//     } catch (error: any) {
//       setIsLoading(false)
//       toast.error(error.response.data.messages[0])
//     }
//   }

//   //Login by google
//   const GOOGLE_AUTH_BASE_URL = `${import.meta.env.VITE_REACT_APP_URL}/oauth2/authorization/google`
//   const [searchParams, setSearchParams] = useSearchParams()
//   const token = searchParams.get('token')
//   const refreshToken = searchParams.get('refresh-token')

//   useEffect(() => {
//     if (token) {
//       dispatch(setToken(token))
//       dispatch(setRefreshToken(refreshToken))
//       setIsLoading(true)
//       const getUserProfile = async () => {
//         try {
//           const resp = await axiosClient.get('/user', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           })
//           dispatch(updateProfile(resp.data.data))
//           setIsLoading(false)
//           toast.success('Đăng nhập thành công!')
//           navigate('/')
//         } catch (error: any) {
//           toast.error(error.response.data.messages[0])
//           setIsLoading(false)
//         }
//       }
//       getUserProfile()
//     } else {
//       setIsLoading(false)
//       navigate('/buyer/login')
//       setSearchParams({})
//     }
//   }, [token])

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: yupResolver(validationSchema),
//   })
//   return (
//     <section className="my-10 grid lg:grid-cols-2 grid-cols-1 place-items-center align-element">
//       <div className="mx-6 lg:mx-0">
//         <img src={login} alt="Ảnh login" />
//       </div>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="card lg:w-[500px] md:w-[500px] w-[300px] p-8 bg-base-100 shadow-xl"
//       >
//         <h3 className="md:text-2xl lg:text-2xl pb-2 font-semibold text-center text-primary">
//           Chào mừng bạn đến với <br /> Nội thất Fnest!
//         </h3>
//         <p className="md:text-xl lg:text-xl text-sm font-bold text-center">Đăng nhập bằng tài khoản của bạn</p>
//         <div className="form-control">
//           <FormInput
//             prop="email"
//             type="text"
//             label="Email(*)"
//             register={register}
//             placeholder="abc123@gmail.com"
//             errorMessage={errors.email?.message}
//           />
//         </div>
//         <FormInput
//           prop="password"
//           type="password"
//           label="Mật khẩu(*)"
//           placeholder="Tối thiểu 8 ký tự"
//           register={register}
//           errorMessage={errors.password?.message}
//         />
//         <button type="submit" className="btn btn-outline btn-primary mt-4 capitalize">
//           {isLoading ? <LoadingButton /> : 'Đăng nhập'}
//         </button>
//         <p className="text-left text-sm text-primary p-2">
//           <Link to="/buyer/forgot-password" className="">
//             Quên mật khẩu?
//           </Link>
//         </p>
//         <div className="divider">OR</div>
//         <Link to={GOOGLE_AUTH_BASE_URL}>
//           <div className="btn btn-ghost flex justify-center w-full items-center text-center">
//             <FcGoogle className="w-12 h-12 text-primary" />
//             <p className="hidden md:block lg:block"> Đăng nhập bằng Google</p>
//           </div>
//         </Link>
//         <div className="flex items-center justify-center text-center my-4 text-sm">
//           <p> Bạn mới biết đến Fnest?</p>
//           <Link to="/buyer/signup" className="ml-2 link link-hover link-primary">
//             Đăng ký ngay!
//           </Link>
//         </div>
//       </form>
//     </section>
//   )
// }

// export default Login

import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import axiosClient from '@/libs/axios-client'
import commonApi from '@/api/commonApi'
import { addAuth, setRefreshToken, setToken, updateProfile } from '@/redux/reducers/authSlice'
import login from '@/assets/images/login.jpg'
import { FcGoogle } from 'react-icons/fc'
import { FormInput, LoadingButton } from '@/components'
import { LoginApiType } from '@/types/user.type'

export type FormData = LoginApiType

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const validationSchema = yup.object({
    email: yup.string().email('Email không hợp lệ!').required('Không được để trống'),
    password: yup.string().required('Không được để trống'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    const userLogin = {
      email: data.email,
      password: data.password,
    }
    try {
      const resp = await commonApi.loginBuyer(userLogin)
      if (resp.status === 200) {
        dispatch(addAuth(resp.data.data))
        toast.success('Đăng nhập thành công')
        navigate('/')
      } else {
        toast.error('Đăng nhập thất bại')
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = searchParams.get('token')
    const refreshToken = searchParams.get('refresh-token')
    if (token) {
      dispatch(setToken(token))
      if (refreshToken) {
        dispatch(setRefreshToken(refreshToken))
      }
      const getUserProfile = async () => {
        setIsLoading(true)
        try {
          const resp = await axiosClient.get('/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          dispatch(updateProfile(resp.data.data))
          toast.success('Đăng nhập thành công!')
          navigate('/')
        } catch (error: any) {
          toast.error(error.response.data.messages[0])
        } finally {
          setIsLoading(false)
        }
      }
      getUserProfile()
    }
  }, [searchParams, dispatch, navigate])

  const GOOGLE_AUTH_BASE_URL = `${import.meta.env.VITE_REACT_APP_URL}/oauth2/authorization/google`

  return (
    <section className="my-10 grid lg:grid-cols-2 grid-cols-1 place-items-center align-element">
      <div className="mx-6 lg:mx-0">
        <img src={login} alt="Ảnh login" />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card lg:w-[500px] md:w-[500px] w-[300px] p-8 bg-base-100 shadow-xl"
      >
        <h3 className="md:text-2xl lg:text-2xl pb-2 font-semibold text-center text-primary">
          Chào mừng bạn đến với <br /> Nội thất Fnest!
        </h3>
        <p className="md:text-xl lg:text-xl text-sm font-bold text-center">Đăng nhập bằng tài khoản của bạn</p>
        <div className="form-control">
          <FormInput
            prop="email"
            type="text"
            label="Email(*)"
            register={register}
            placeholder="abc123@gmail.com"
            errorMessage={errors.email?.message}
          />
        </div>
        <FormInput
          prop="password"
          type="password"
          label="Mật khẩu(*)"
          placeholder="Tối thiểu 8 ký tự"
          register={register}
          errorMessage={errors.password?.message}
        />
        <button type="submit" className="btn btn-outline btn-primary mt-4 capitalize">
          {isLoading ? <LoadingButton /> : 'Đăng nhập'}
        </button>
        <p className="text-left text-sm text-primary p-2">
          <Link to="/buyer/forgot-password" className="">
            Quên mật khẩu?
          </Link>
        </p>
        <div className="divider">OR</div>
        <Link to={GOOGLE_AUTH_BASE_URL}>
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
      </form>
    </section>
  )
}

export default Login
