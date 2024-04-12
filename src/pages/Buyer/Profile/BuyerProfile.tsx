// import { FormInput } from '@/components'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { selectAuth } from '@/redux/reducers/authSlice'
import { formatDate } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { CiCircleCheck } from 'react-icons/ci'
import { useSelector } from 'react-redux'

const BuyerProfile = () => {
  const user = useSelector(selectAuth)
  const axiosPrivate = useAxiosBuyerPrivate()

  const { data: userProfile } = useQuery({
    queryKey: [Buyer_QueryKeys.USER_PROFILE],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/user')
      return resp.data.data
    },
    enabled: !!user.authData.accessToken,
  })

  return (
    <div className="mx-4 my-2">
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Thay đổi thông tin cá nhân</h3>
          <div className="grid grid-cols-2 gap-2">
            {/* <FormInput type="text" label="Họ và tên" name="name" value="" placeholder="Nguyễn Văn A" />
            <FormInput type="text" label="Số điện thoại" name="phone" value="" placeholder="0351232345" />
            <FormInput type="email" label="Email" name="email" value="" placeholder="nguyenvan@gmail.com" />
            <FormInput type="date" label="Ngày sinh" name="birthday" value="" placeholder="Thôn Trung Bình..." /> */}
          </div>
          <div className="modal-action">
            <a href="#" className="btn">
              Đóng
            </a>
            <button className="btn btn-primary text-white">Lưu</button>
          </div>
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
              <td>ID</td>
              <td>{userProfile.id}</td>
            </tr>
            <tr>
              <td>Họ và tên</td>
              <td>{userProfile.fullName}</td>
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
              <td>{userProfile.gender}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-center">
          <a href="#my_modal_8" className="btn btn-sm">
            Thay đổi thông tin
          </a>
        </div>
      </div>
    </div>
  )
}

export default BuyerProfile
