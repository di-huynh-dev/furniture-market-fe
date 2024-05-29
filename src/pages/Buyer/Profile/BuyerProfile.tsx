// import { FormInput } from '@/components'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { selectAuth, updateProfile } from '@/redux/reducers/authSlice'
import { formatDate } from '@/utils/helpers'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CiCircleCheck } from 'react-icons/ci'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { UserType } from '@/types/user.type'
import { useNavigate } from 'react-router-dom'

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

const BuyerProfile = () => {
  const user = useSelector(selectAuth)
  const axiosPrivate = useAxiosBuyerPrivate()
  const dispatch = useDispatch()
  const client = useQueryClient()
  const navigation = useNavigate()

  const { data: userProfile, isLoading } = useQuery({
    queryKey: [Buyer_QueryKeys.USER_PROFILE],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/user')
      return resp.data.data
    },
    enabled: !!user.authData.accessToken,
  })

  const { data: following, isLoading: isFollowingLoading } = useQuery({
    queryKey: [Buyer_QueryKeys.FOLLOWING_PEOPLE],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/user/connection/following-people')
      return resp.data.data
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: async ({ fullName, birthday, gender }: FormData) => {
      const resp = await axiosPrivate.patch('/user', { fullName, gender, birthday })
      return resp
    },
    onSuccess: (resp) => {
      dispatch(updateProfile(resp.data.data))
      client.invalidateQueries({
        queryKey: [Buyer_QueryKeys.USER_PROFILE],
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
          queryKey: [Buyer_QueryKeys.USER_PROFILE],
        })
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

  if (isLoading || isFollowingLoading) return <div>Loading...</div>

  return (
    <div className="mx-4 my-2">
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

      <div className="border-b-2 pb-5 lg:text-lg text-sm">
        <div className="font-bold capitalize">Thông tin cá nhân</div>
        <div className="text-gray-500 text-sm">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
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
              <td>{userProfile.id}</td>
            </tr>
            <tr>
              <td>Họ và tên</td>
              <td>{userProfile.fullName}</td>
              <td className="hidden md:table-cell">
                Đang theo dõi:{' '}
                <button
                  onClick={() => {
                    const dialog = document.getElementById('my_modal_1') as HTMLDialogElement
                    dialog.showModal()
                  }}
                  className="link text-primary"
                >
                  {following.length}
                </button>
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg text-center">Đang theo dõi</h3>
                    {following.map((user: UserType) => (
                      <div>
                        <button onClick={() => navigation(`/shop/${user.id}`)}>
                          <div className="flex gap-2 items-center">
                            <img
                              src={user.avatar}
                              alt={user.fullName}
                              className="w-10 h-10 object-cover rounded-full"
                            />
                            <p className="font-bold uppercase">{user.fullName}</p>
                          </div>
                        </button>
                      </div>
                    ))}
                    <div className="modal-action">
                      <form method="dialog">
                        <button className="btn">Đóng</button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </td>
            </tr>
            <tr>
              <td>Email</td>
              <td>
                <div className="flex items-center gap-2">
                  <span> {userProfile.email}</span> <CiCircleCheck className="text-success font-bold w-10 h-10" />
                </div>
              </td>
            </tr>
            <tr>
              <td>Số điện thoại</td>
              <td>{userProfile.phone}</td>
            </tr>
            <tr>
              <td>Ngày sinh</td>
              <td>{formatDate(userProfile.birthday)}</td>
            </tr>
            <tr>
              <td>Giới tính</td>
              <td>{userProfile.gender === 'MALE' ? 'Nam' : 'Nữ'}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-center gap-4">
          <a href="#my_modal_8" className="btn btn-sm">
            Thay đổi thông tin
          </a>
          <a className="btn btn-sm" href="#change_password">
            Đổi mật khẩu
          </a>
        </div>
      </div>
    </div>
  )
}

export default BuyerProfile
