import { Buyer_QueryKeys } from '@/constants/query-keys'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { OrderItem } from '@/types/order.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import OrderItemComponent from './components/OrderItem'

const BuyerPurchase = () => {
  const [activeTab, setActiveTab] = useState('')
  const axiosPrivate = useAxiosBuyerPrivate()
  const [orderListByStatus, setOrderListByStatus] = useState<OrderItem[]>([])
  const client = useQueryClient()

  const { isLoading: isLoadingOrders } = useQuery({
    queryKey: [Buyer_QueryKeys.ORDER_LIST],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/buyer/order')
      setOrderListByStatus(resp.data.data.content)
      return resp.data.data.content
    },
  })

  const getOrderListByStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const resp = await axiosPrivate.get(`/buyer/order/by-status?status=${status}`)
      return resp
    },
    onSuccess: (resp) => {
      setOrderListByStatus(resp.data.data.content)
    },
  })

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName)
    if (tabName !== '') {
      getOrderListByStatusMutation.mutate(tabName)
    } else {
      client.invalidateQueries({ queryKey: [Buyer_QueryKeys.ORDER_LIST] })
    }
  }

  if (isLoadingOrders) {
    return <div>Loading...</div>
  }

  return (
    <div className="mx-4 my-2">
      <div className="border-b-2 pb-5 lg:text-lg text-sm">
        <div className="grid md:grid-cols-2">
          <div>
            <div className="font-bold capitalize">Đơn hàng của tôi</div>
            <div className="text-gray-500 text-sm">Quản lý tất cả đơn hàng của tài khoản</div>
          </div>
        </div>
      </div>
      <div className="my-2">
        <div role="tablist" className="lg:tabs tabs-lifted">
          <div className="lg:flex">
            <div>
              <div
                onClick={() => handleTabClick('TO_SHIP')}
                role="tab"
                className={`tab ${activeTab === 'TO_SHIP' ? 'tab-active font-semibold text-primary ' : 'indicator'}`}
              >
                Chờ vận chuyển
                <span className={`${activeTab === 'TO_SHIP' ? 'badge text-primary' : 'indicator-item badge'}`}>
                  {activeTab === 'TO_SHIP' && orderListByStatus.length}
                </span>
              </div>
            </div>
            <div>
              <div
                role="tab"
                onClick={() => handleTabClick('SHIPPING')}
                className={`tab ${activeTab === 'SHIPPING' ? 'tab-active font-semibold text-primary' : 'indicator'}`}
              >
                Đang giao
                <span className={` ${activeTab === 'SHIPPING' ? 'badge text-primary' : 'indicator-item badge'}`}>
                  {activeTab === 'SHIPPING' && orderListByStatus.length}
                </span>
              </div>
              <div
                role="tab"
                onClick={() => handleTabClick('COMPLETED')}
                className={`tab ${activeTab === 'COMPLETED' ? 'tab-active font-semibold text-primary' : 'indicator'}`}
              >
                Đã nhận
                <span className={` ${activeTab === 'COMPLETED' ? 'badge text-primary' : 'indicator-item badge'}`}>
                  {activeTab === 'COMPLETED' && orderListByStatus.length}
                </span>
              </div>

              <div
                role="tab"
                onClick={() => handleTabClick('CANCELLED')}
                className={`tab ${activeTab === 'CANCELLED' ? 'tab-active font-semibold text-primary' : 'indicator'}`}
              >
                Đã hủy
                <span className={` ${activeTab === 'CANCELLED' ? 'badge text-primary' : 'indicator-item badge'}`}>
                  {activeTab === 'CANCELLED' && orderListByStatus.length}
                </span>
              </div>
              <div
                role="tab"
                onClick={() => handleTabClick('FAILED_DELIVERY')}
                className={`tab ${
                  activeTab === 'FAILED_DELIVERY' ? 'tab-active font-semibold text-primary' : 'indicator'
                }`}
              >
                Thất bại
                <span className={` ${activeTab === 'FAILED_DELIVERY' ? 'badge text-primary' : 'indicator-item badge'}`}>
                  {activeTab === 'FAILED_DELIVERY' && orderListByStatus.length}
                </span>
              </div>
              <div
                role="tab"
                onClick={() => handleTabClick('')}
                className={`tab ${activeTab === '' ? 'tab-active  font-semibold text-primary' : 'indicator'}`}
              >
                Tất cả
                <span className={`${activeTab === '' ? 'badge text-primary' : 'badge indicator-item'}`}>
                  {activeTab === '' && orderListByStatus.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      {orderListByStatus.map((order: OrderItem) => {
        return <OrderItemComponent order={order} key={order.id} />
      })}

      {orderListByStatus.length === 0 && (
        <div className="text-center my-2 italic text-gray-500">
          Bạn chưa có đơn hàng nào. Hãy mua sắm thoải mái bạn nhé!
        </div>
      )}
    </div>
  )
}

export default BuyerPurchase
