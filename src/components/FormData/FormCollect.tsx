/* eslint-disable @typescript-eslint/no-explicit-any */
import contact from '@/assets/images/contact.png'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { CollectInfoType } from '@/types/collectInfo.type'
import { toast } from 'react-toastify'

const FormCollect = () => {
  const validationSchema = yup.object({
    name: yup.string().required('Không bỏ trống!'),
    email: yup.string().email('Email không hợp lệ!').required('Không được để trống'),
    phone: yup.string().required('Không bỏ trống!'),
    content: yup.string().required('Không bỏ trống!'),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CollectInfoType>({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = (data: CollectInfoType) => {
    try {
      const formData = new FormData()
      formData.append('entry.2005620554', data.name)
      formData.append('entry.1045781291', data.email)
      formData.append('entry.1166974658', data.phone)
      formData.append('entry.839337160', data.content)

      fetch('https://docs.google.com/forms/d/e/1FAIpQLSe4BgSCNUyQn53TA7lw9Tt7drNLlfEuNqyYLDyRO_3NcrX7OA/formResponse', {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      })
      reset()
      toast.success('Gửi góp ý thành công!')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen  px-5 py-5">
      <div className="xl:max-w-7xl bg-white drop-shadow-xl border border-black/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
        <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex">
          <img src={contact} alt="login" className="h-[500px]" />
        </div>
        <div className="mx-auto w-full lg:w-1/2 md:p-10 py-5 md:py-0">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-primary">
            Đóng góp ý kiến về trải nghiệm
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <input
                type="text"
                placeholder="Họ và tên"
                {...register('name')}
                className="input input-bordered input-primary w-full text-black placeholder:text-black/70"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              <input
                type="text"
                placeholder="Email của bạn"
                {...register('email')}
                className="input input-bordered input-primary w-full text-black placeholder:text-black/70"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              <input
                type="text"
                placeholder="Số điện thoại của bạn"
                {...register('phone')}
                className="input input-bordered input-primary w-full text-black placeholder:text-black/70"
              />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
              <textarea
                placeholder="Nội dung"
                {...register('content')}
                className="textarea textarea-primary textarea-bordered"
              />
              {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}

              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                <button type="submit" className="btn btn-active btn-primary btn-block max-w-[200px] text-white">
                  Gửi
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormCollect
