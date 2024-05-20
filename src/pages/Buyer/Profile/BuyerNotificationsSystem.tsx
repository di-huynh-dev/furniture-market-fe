import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import Notify from './components/Notify'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import { useQuery } from '@tanstack/react-query'
import { Notification } from '@/types/notify.type'
import { LoadingComponent } from '@/components'

const BuyerNotificationsSystem = () => {
  const axiosPrivate = useAxiosBuyerPrivate()

  const { data, isLoading: isLoadingOrders } = useQuery({
    queryKey: [Buyer_QueryKeys.USER_NOTIFICATION],
    queryFn: async () => {
      const response = await axiosPrivate.get('/user/announce?type=ACCOUNT')

      return response.data.data
    },
  })

  if (isLoadingOrders) {
    return <LoadingComponent />
  }

  return (
    <div className="mx-4 my-2">
      <div className="border-b-2 pb-5 lg:text-lg text-sm">
        <div className="grid md:grid-cols-2">
          <div>
            <div className="font-bold capitalize">Thông báo đơn hàng của tôi</div>
          </div>
        </div>
      </div>
      {data.lenght === 0 && <p className="text-xl">Không có thông báo nào</p>}
      {data.map((item: Notification) => (
        <Notify title={'Hệ thống'} content={item.content[1]} time={item.createdAt} navigation={item.content[0]} />
      ))}
    </div>
  )
}

export default BuyerNotificationsSystem
