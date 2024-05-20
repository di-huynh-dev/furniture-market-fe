import { NotifyProps } from '@/types/notify.type'
import orderImage from '@/assets/images/order-notify.jpg'
import accountImage from '@/assets/images/account-setting.jpg'
import { useNavigate } from 'react-router-dom'

const Notify = ({ title, content, time, navigation }: NotifyProps) => {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-6 gap-2 mb-2 my-2 border-b">
      <div className="flex items-center justify-center">
        <figure>
          <img src={title === 'Đơn hàng' ? orderImage : accountImage} alt="Thông báo" className="h-20 w-20" />
        </figure>
      </div>
      <div className="col-span-4">
        <div>
          <p>{title}</p>
          <div className="text-sm text-gray-500">
            <p>{content}</p>
            <p className="text-gray-500 italic">{time}</p>
          </div>
        </div>
      </div>
      {title === 'Đơn hàng' && (
        <div>
          <button
            onClick={() => navigate(`/buyer/account/purchase/order/${navigation}`)}
            className="btn btn-outline btn-sm"
          >
            Xem chi tiết
          </button>
        </div>
      )}
    </div>
  )
}

export default Notify
