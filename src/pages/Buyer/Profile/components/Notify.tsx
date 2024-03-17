import { NotifyProps } from '@/types/notify.type'

const Notify = ({ title, content, time }: NotifyProps) => {
  return (
    <div className="grid grid-cols-6 gap-2 mb-2">
      <div className="flex items-center justify-center">
        <figure>
          <img
            src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
            alt="Movie"
            className="h-20 w-20"
          />
        </figure>
      </div>
      <div className="col-span-4">
        <div>
          <p>{title}</p>
          <div className="text-sm text-gray-500">
            <p>{content}</p>
            <p>{time}</p>
          </div>
        </div>
      </div>
      <div>
        <button className="btn btn-outline btn-sm">Xem chi tiết</button>
      </div>
    </div>
  )
}

export default Notify
