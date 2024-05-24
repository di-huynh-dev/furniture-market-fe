import { useState } from 'react'
import { OrderItem, ResponseItem } from '@/types/order.type'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { Seller_QueryKeys } from '@/constants/query-keys'
import DataTable, { TableColumn } from 'react-data-table-component'
import { formatPrice } from '@/utils/helpers'
import Papa from 'papaparse'
import { LoadingComponent } from '@/components'

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

  const exportToCSV = () => {
    const filteredOrders = filterOrdersByStatus(activeTab)
    const csvData = filteredOrders.map((order) => ({
      'Mã đơn': order.id,
      'Danh sách sản phẩm': order.responses
        .map((item: ResponseItem) => `ID: ${item.productId} - ${item.productName}`)
        .join(', '),
      'Trạng thái đơn': order.status,
      'Tổng tiền': formatPrice(order.total),
    }))

    const csv = Papa.unparse(csvData)
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', 'orders.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoadingOrders) {
    return <LoadingComponent />
  }

  const filteredOrders = filterOrdersByStatus(activeTab)

  const columns: TableColumn<OrderItem>[] = [
    { name: 'Mã đơn', cell: (row) => row.id },
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
    <section className="mx-4 my-2 text-sm">
      <div className="card shadow-lg m-2 bg-white">
        <div className="md:card-body">
          <div role="tablist" className="md:tabs tabs-lifted">
            <div
              role="tab"
              onClick={() => handleTabClick('')}
              className={`tab ${
                activeTab === '' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
              }`}
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
            <DataTable
              title={
                <div className="md:flex justify-between">
                  <p className="md:text-xl text-base">Danh sách đơn hàng</p>
                  <button onClick={exportToCSV} className="mb-4 btn btn-outline btn-sm ">
                    Xuất báo cáo
                  </button>
                </div>
              }
              columns={columns}
              data={filteredOrders}
              progressPending={isLoadingOrders}
              progressComponent={<LoadingComponent />}
              highlightOnHover
              pagination
            />
            ;
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrdersManagement
