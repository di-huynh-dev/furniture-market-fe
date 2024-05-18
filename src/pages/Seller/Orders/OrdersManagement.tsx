import { useState } from 'react'
import { OrderItem, ResponseItem } from '@/types/order.type'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { Seller_QueryKeys } from '@/constants/query-keys'
import DataTable, { TableColumn } from 'react-data-table-component'
import { formatPrice } from '@/utils/helpers'

const OrdersManagement = () => {
  const [activeTab, setActiveTab] = useState('')
  const axiosPrivate = useAxiosPrivate()
  const [orderListByStatus, setOrderListByStatus] = useState<OrderItem[]>([])

  const { isLoading: isLoadingOrders } = useQuery({
    queryKey: [Seller_QueryKeys.ORDER_LIST],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/seller/order')
      setOrderListByStatus(resp.data.data)
      return resp.data.data
    },
  })

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName)
  }
  const filterOrdersByStatus = (status: string) => {
    if (!status) return orderListByStatus
    return orderListByStatus.filter((order) => order.status === status)
  }

  if (isLoadingOrders) {
    return <div>Loading...</div>
  }

  const filteredOrders = filterOrdersByStatus(activeTab)

  const columns: TableColumn<OrderItem>[] = [
    { name: 'Mã đơn', selector: (row) => row.id },
    {
      name: 'Danh sách sản phẩm',
      cell: (row) => (
        <div>
          {row.responses.map((item: ResponseItem) => (
            <p>{item.productName}</p>
          ))}
        </div>
      ),
    },
    { name: 'Trạng thái', selector: (row) => row.status },
    { name: 'Tổng', selector: (row) => formatPrice(row.total) },
  ]

  return (
    <div className="shadow-lg m-2 bg-white">
      <div role="tablist" className="tabs tabs-lifted">
        <div
          role="tab"
          onClick={() => handleTabClick('')}
          className={`tab ${activeTab === '' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''}`}
        >
          Tất cả
        </div>
        <div
          role="tab"
          className={`tab ${
            activeTab === 'TO_SHIP' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
          onClick={() => handleTabClick('TO_SHIP')}
        >
          Chờ vận chuyển
        </div>
        <div
          role="tab"
          className={`tab ${
            activeTab === 'SHIPPING' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
          onClick={() => handleTabClick('SHIPPING')}
        >
          Đang giao
        </div>
        <div
          role="tab"
          className={`tab ${
            activeTab === 'COMPLETED' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
          onClick={() => handleTabClick('COMPLETED')}
        >
          Đã hoàn thành
        </div>
        <div
          role="tab"
          onClick={() => handleTabClick('CANCELLED')}
          className={`tab ${
            activeTab === 'CANCELLED' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
        >
          {' '}
          Đã hủy
        </div>

        <div
          role="tab"
          onClick={() => handleTabClick('FAILED_DELIVERY')}
          className={`tab ${
            activeTab === 'FAILED_DELIVERY' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
        >
          Thất bại
        </div>
      </div>

      <div className="m-4">
        <DataTable columns={columns} data={filteredOrders} pagination />;
      </div>
    </div>
  )
}

export default OrdersManagement
