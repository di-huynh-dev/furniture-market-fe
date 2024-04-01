import { LoadingComponent } from '@/components'
import { useProfile } from '@/hooks/useProfile'
import { selectSellerAuth, updateProfile } from '@/redux/reducers/seller/sellerAuthSlice'
import { formatDate } from '@/utils/helpers'
import { CiEdit } from 'react-icons/ci'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { QueryKeys } from '@/constants/query-keys'

type FormData = {
  fullName: string
  birthday: string
  gender: string
}
const SettingProfile = () => {
  const { data: userProfile, isLoading, isError, error } = useProfile()
  const axiosPrivate = useAxiosPrivate()
  const user = useSelector(selectSellerAuth)
  const dispatch = useDispatch()
  const client = useQueryClient()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      fullName: user?.authData.user.fullName,
      birthday: user?.authData.user.birthday,
      gender: user?.authData.user.gender,
    },
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const updateProfileMutation = useMutation({
    mutationFn: async ({ fullName, birthday, gender }: FormData) => {
      const resp = await axiosPrivate.patch('/user', { fullName, gender, birthday })
      return resp
    },
    onSuccess: (resp) => {
      dispatch(updateProfile(resp.data.data))
      client.invalidateQueries({
        queryKey: [QueryKeys.USER_PROFILE],
      })
      toast.success(resp.data.messages[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const onSubmit = (data: FormData) => {
    updateProfileMutation.mutate({ fullName: data.fullName, gender: data.gender, birthday: data.birthday })
  }

  if (isLoading) {
    return <LoadingComponent />
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }
  return (
    <section className="mx-4 my-2 text-sm">
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Thay đổi thông tin cá nhân</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="py-4">
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Họ và tên</span>
                </div>
                <input
                  type="text"
                  {...register('fullName')}
                  placeholder={user.authData.user.fullName}
                  className="input input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Ngày sinh</span>
                </div>
                <input type="date" {...register('birthday')} className="input input-bordered w-full max-w-xs my-2" />
              </label>
              <select {...register('gender')} className="select select-bordered w-full max-w-xs">
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

      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <div className="mx-20">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <tbody>
                  <tr>
                    <td>Tên chủ shop</td>
                    <td>Email</td>
                    <td>Ngày sinh</td>
                    <td>Số điện thoại</td>
                    <td>Giới tính</td>
                  </tr>
                  <tr>
                    <td>{userProfile?.fullName}</td>
                    <td>{userProfile?.email}</td>
                    <td>{userProfile?.birthday ? formatDate(userProfile?.birthday) : '-'}</td>
                    <td>{userProfile?.phone}</td>
                    <td>{userProfile?.gender === 'FEMALE' ? 'Nữ' : 'Nam'}</td>
                    <td>
                      <a className="btn btn-ghost" href="#my_modal_8">
                        <CiEdit className="w-6 h-6 text-primary" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingProfile
