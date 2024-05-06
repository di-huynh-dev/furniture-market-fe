import { LoadingComponent } from '@/components'
import { useProfile } from '@/hooks/useProfile'
import { removeAuth, selectSellerAuth, updateProfile } from '@/redux/reducers/seller/sellerAuthSlice'
import { formatDate } from '@/utils/helpers'
import { CiCircleCheck } from 'react-icons/ci'
import { useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Seller_QueryKeys } from '@/constants/query-keys'

type FormData = {
  fullName: string
  birthday: string
  gender: string
}

type ChangePasswordFormData = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const SettingProfile = () => {
  const { data: userProfile, isLoading, isError, error } = useProfile()
  const axiosPrivate = useAxiosPrivate()
  const user = useSelector(selectSellerAuth)
  const dispatch = useDispatch()
  const client = useQueryClient()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const updateProfileMutation = useMutation({
    mutationFn: async ({ fullName, birthday, gender }: FormData) => {
      const resp = await axiosPrivate.patch('/user', { fullName, gender, birthday })
      return resp
    },
    onSuccess: (resp) => {
      dispatch(updateProfile(resp.data.data))
      client.invalidateQueries({
        queryKey: [Seller_QueryKeys.USER_PROFILE],
      })
      toast.success(resp.data.messages[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const updatePasswordMutation = useMutation({
    mutationFn: async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
      const resp = await axiosPrivate.patch('/user/password', { oldPassword, newPassword })
      return resp
    },
    onSuccess: (resp) => {
      dispatch(removeAuth())
      toast.success(resp.data.messages[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const resp = await axiosPrivate.patch('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        dispatch(updateProfile(resp.data.data))
        client.invalidateQueries({
          queryKey: [Seller_QueryKeys.USER_PROFILE],
        })
        const dialog = document.getElementById('update_avatar') as HTMLDialogElement
        dialog.close()
      }
    } catch (error) {
      console.error('Error updating avatar:', error)
    }
  }

  const onSubmit = (data: FormData) => {
    updateProfileMutation.mutate({ fullName: data.fullName, gender: data.gender, birthday: data.birthday })
  }

  const onSubmitPassword = (data: ChangePasswordFormData) => {
    updatePasswordMutation.mutate({ oldPassword: data.oldPassword, newPassword: data.newPassword })
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      fullName: user?.authData.user.fullName,
      birthday: user?.authData.user.birthday,
      gender: user?.authData.user.gender,
    },
  })

  const schema = yup.object().shape({
    oldPassword: yup.string().required('Old password is required'),
    newPassword: yup.string().required('New password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('newPassword')], 'Passwords must match'),
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(schema),
  })

  if (isLoading) {
    return <LoadingComponent />
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }
  return (
    <section className=" my-2 text-sm">
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Thay đổi thông tin cá nhân</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="py-4">
              <label className="form-control w-full  my-2">
                <div className="label">
                  <span className="label-text">Họ và tên</span>
                </div>
                <input
                  type="text"
                  {...register('fullName')}
                  placeholder={user.authData.user.fullName}
                  className="input input-bordered w-full "
                />
              </label>
              <label className="form-control w-full  my-2">
                <div className="label">
                  <span className="label-text">Ngày sinh</span>
                </div>
                <input type="date" {...register('birthday')} className="input input-bordered w-full  my-2" />
              </label>
              <select {...register('gender')} className="select select-bordered w-full ">
                <option value="" disabled selected>
                  Giới tính
                </option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
            <div className="modal-action">
              <div className="modal-action">
                <button className="btn btn-primary text-white" type="submit">
                  Lưu
                </button>
                <a href="#" className="btn">
                  Đóng
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="modal" role="dialog" id="change_password">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Đổi mật khẩu</h3>
          <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <div className="py-4">
              <label className="form-control w-full my-2">
                <div className="label">
                  <span className="label-text">Mật khẩu cũ (*)</span>
                </div>
                <input
                  type="password"
                  {...registerPassword('oldPassword')}
                  placeholder="Mật khẩu cũ"
                  className="input input-bordered w-full"
                />
              </label>
              {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>}
              <label className="form-control w-full my-2">
                <div className="label">
                  <span className="label-text">Mật khẩu mới (*)</span>
                </div>
                <input
                  type="password"
                  {...registerPassword('newPassword')}
                  placeholder="Mật khẩu mới"
                  className="input input-bordered w-full"
                />
              </label>
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
              <label className="form-control w-full my-2">
                <div className="label">
                  <span className="label-text">Mật khẩu xác nhận (*)</span>
                </div>
                <input
                  type="password"
                  {...registerPassword('confirmPassword')}
                  placeholder="Mật khẩu xác nhận"
                  className="input input-bordered w-full"
                />
              </label>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
            <div className="modal-action">
              <div className="modal-action">
                <button className="btn btn-primary text-white" type="submit">
                  Lưu
                </button>
                <a href="#" className="btn">
                  Đóng
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="modal" id="update_avatar">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Cập nhật ảnh đại diện</h3>
          <form>
            <div className="py-4">
              <label htmlFor="avatar" className="form-control w-full my-2">
                <div className="label">
                  <span className="label-text">Chọn ảnh đại diện mới</span>
                </div>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={onAvatarChange}
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div className="modal-action">
              <a href="#" className="btn">
                Hủy
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <span className="font-bold">Thông tin chủ sở hữu</span>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <tbody>
                <tr>
                  <td>Ảnh đại diện</td>
                  <td>
                    <div className="flex items-center gap-4">
                      <img src={user.authData.user.avatar} className="w-20 h-20 rounded-full" alt="" />
                      <a href="#update_avatar" className="btn btn-sm">
                        Cập nhật
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>ID</td>
                  <td>{user.authData.user.id}</td>
                </tr>
                <tr>
                  <td>Họ và tên</td>
                  <td>{user.authData.user.fullName}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span> {user.authData.user.email}</span>{' '}
                      <CiCircleCheck className="text-success font-bold w-10 h-10" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Số điện thoại</td>
                  <td>{user.authData.user.phone}</td>
                </tr>
                <tr>
                  <td>Ngày sinh</td>
                  <td>{formatDate(user.authData.user.birthday)}</td>
                </tr>
                <tr>
                  <td>Giới tính</td>
                  <td>{userProfile?.gender === 'FEMALE' ? 'Nữ' : 'Nam'}</td>
                </tr>
                <tr>
                  <td>Trạng thái tài khoản</td>
                  <td>{userProfile?.status ? 'Đang hoạt động' : 'Đã khóa'}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-center gap-4">
              <a href="#my_modal_8" className="btn btn-sm">
                Cập nhật thông tin
              </a>
              <a className="btn btn-sm" href="#change_password">
                Đổi mật khẩu
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingProfile
