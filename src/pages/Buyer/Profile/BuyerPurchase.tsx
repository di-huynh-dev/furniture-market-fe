import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { OrderItem } from '@/types/order.type'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import OrderItemComponent from './components/OrderItem'

const BuyerPurchase = () => {
  const [activeTab, setActiveTab] = useState('')
  const axiosPrivate = useAxiosBuyerPrivate()
  const [orderListByStatus, setOrderListByStatus] = useState<OrderItem[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(6)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchOrders = async (status = '', page = 0, size = 6) => {
    setLoading(true)
    const endpoint = status
      ? `/buyer/order/by-status?status=${status}&currentPage=${page}&pageSize=${size}`
      : `/buyer/order?currentPage=${page}&pageSize=${size}`
    const resp = await axiosPrivate.get(endpoint)
    setOrderListByStatus(resp.data.data.content || [])
    setCurrentPage(resp.data.data.currentPage)
    setTotalPages(resp.data.data.totalPages)
    setPageSize(resp.data.data.pageSize)
    setLoading(false)
    return resp.data.data.content
  }

  const fetchOrdersMutation = useMutation({
    mutationFn: async () => fetchOrders(activeTab, currentPage, pageSize),
  })

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName)
    setCurrentPage(0) // Reset page when tab changes
    fetchOrdersMutation.mutate()
  }

  useEffect(() => {
    fetchOrdersMutation.mutate()
  }, [currentPage, pageSize, activeTab])

  const statusLabels: { [key: string]: string } = {
    TO_SHIP: 'Chờ vận chuyển',
    SHIPPING: 'Đang giao',
    COMPLETED: 'Đã nhận',
    CANCELLED: 'Đã hủy',
    FAILED_DELIVERY: 'Thất bại',
    REFUNDED: 'Hoàn tiền/Trả hàng',
    '': 'Tất cả',
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
            {Object.keys(statusLabels).map((status) => (
              <div key={status}>
                <div
                  onClick={() => handleTabClick(status)}
                  role="tab"
                  className={`tab ${activeTab === status ? 'tab-active font-semibold text-primary ' : 'indicator'}`}
                >
                  {statusLabels[status]}
                  <span className={`${activeTab === status ? 'badge text-primary' : 'indicator-item badge'}`}>
                    {activeTab === status && orderListByStatus.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <p>Tất cả sản phẩm</p>
        <div className="flex gap-2 items-center">
          <div className="text-sm">
            Trang {currentPage + 1}/{totalPages}
          </div>
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
              <button
                onClick={() => setCurrentPage(page)}
                key={page}
                className={`join-item btn-xs ${page === currentPage ? 'btn btn-active btn-primary text-white' : 'btn'}`}
              >
                {page + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center">
          <span className="loading loading-ring loading-xs"></span>
          <span className="loading loading-ring loading-sm"></span>
          <span className="loading loading-ring loading-md"></span>
          <span className="loading loading-ring loading-lg"></span>
        </div>
      ) : (
        <>
          {orderListByStatus.map((order: OrderItem) => {
            return <OrderItemComponent order={order} key={order.id} />
          })}

          {orderListByStatus.length === 0 && (
            <div className="text-center my-2">Bạn chưa có đơn hàng nào ở trạng thái này!</div>
          )}
        </>
      )}
    </div>
  )
}

export default BuyerPurchase
