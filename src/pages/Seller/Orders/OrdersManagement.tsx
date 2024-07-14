/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { OrderItem, ResponseItem } from '@/types/order.type'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Seller_QueryKeys } from '@/constants/query-keys'
import DataTable, { TableColumn } from 'react-data-table-component'
import { formatPrice } from '@/utils/helpers'
import Papa from 'papaparse'
import { LoadingComponent } from '@/components'
import { toast } from 'react-toastify'
import { useDebounce } from 'use-debounce'

const OrdersManagement = () => {
  const [activeTab, setActiveTab] = useState('')
  const axiosPrivate = useAxiosPrivate()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500)
  const queryClient = useQueryClient()
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null)
  const [orderListByStatus, setOrderListByStatus] = useState<OrderItem[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Fnest Seller - Tất cả đơn hàng'
  }, [])

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: [Seller_QueryKeys.ORDER_LIST],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/seller/order')
      setOrderListByStatus(resp.data.data)
      return resp.data.data
    },
  })

  useEffect(() => {
    if (debouncedSearchQuery) {
      const filteredOrders = orders.filter((order: OrderItem) => order.id.toString().includes(debouncedSearchQuery))
      setOrderListByStatus(filteredOrders)
    } else {
      setOrderListByStatus(orders)
    }
  }, [debouncedSearchQuery, orders])

  if (isLoadingOrders) {
    return <LoadingComponent />
  }

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
      'Thông tin vận chuyển': `${order.buyerInfo?.receiverName} - ${order.buyerInfo?.receiverPhone} - ${order.buyerInfo?.deliveryAddress}`,
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
    {
      name: 'Trạng thái',
      cell: (row) =>
        row.status === 'TO_SHIP' ? (
          <div className="badge badge-primary text-white">Chờ vận chuyển</div>
        ) : row.status === 'SHIPPING' ? (
          <div className="badge badge-warning text-white">Đang giao</div>
        ) : row.status === 'COMPLETED' ? (
          <div className="badge badge-success text-white">Đã giao</div>
        ) : row.status === 'CANCELLED' ? (
          <div className="badge badge-error text-white">Đã hủy</div>
        ) : row.status === 'REFUNDED' ? (
          <div className="badge badge-neutral text-white">Hoàn tiền</div>
        ) : (
          <div>Giao hàng không thành công</div>
        ),
    },
    { name: 'Thanh toán', cell: (row) => (row.paid ? 'Đã thanh toán' : 'Chưa thanh toán') },
    { name: 'Tổng', selector: (row) => formatPrice(row.total) },
    {
      name: 'Action',
      cell: (row) =>
        row.status === 'TO_SHIP' || row.status === 'SHIPPING' ? (
          <button
            className="link"
            onClick={() => {
              setSelectedOrder(row)
              const dialog = document.getElementById('modal') as HTMLDialogElement
              dialog.showModal()
            }}
          >
            Cập nhật trạng thái
          </button>
        ) : null,
    },
  ]
  const updateOrderStatus = async () => {
    try {
      let status: string = ''
      switch (selectedOrder?.status) {
        case 'TO_SHIP':
          status = 'SHIPPING'
          break
        case 'SHIPPING':
          status = 'COMPLETED'
          break
        default:
          break
      }
      const resp = await axiosPrivate.patch(`/seller/order/status`, {
        orderId: selectedOrder?.id,
        status: status,
      })

      if (resp.status === 200) {
        const dialog = document.getElementById('modal') as HTMLDialogElement
        dialog.close()
        toast.success(resp.data.messages[0])
        queryClient.invalidateQueries({ queryKey: [Seller_QueryKeys.ORDER_LIST] })
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const ExpandedComponent = ({ data }: { data: OrderItem }) => {
    return (
      <div>
        <div className="my-4">
          <div>
            <p className="text-lg">Danh sách sản phẩm</p>
            {data.responses.map((item: ResponseItem) => (
              <div className="grid grid-cols-6 gap-2">
                <div>
                  <p className="font-bold">Mã sản phẩm</p>
                  <p>{item.id}</p>
                </div>
                <div>
                  <p className="font-bold">Tên sản phẩm</p>
                  <p>{item.productName}</p>
                </div>
                <div>
                  <p className="font-bold">Chất liệu</p>
                  <p>{item.productMaterial}</p>
                </div>
                <div>
                  <p className="font-bold">Hình ảnh</p>
                  <img src={item.productThumbnail} alt={item.productName} className="h-12 w-12" />
                </div>
                <div>
                  <p className="font-bold">Số lượng</p>
                  <p>{item.quantity}</p>
                </div>
                <div>
                  <p className="font-bold">Thành tiền</p>
                  <p>{formatPrice(item.total)}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <p className="text-lg">Thông tin vận chuyển</p>
            <p className="font-bold">
              {data.buyerInfo?.receiverName} - {data.buyerInfo?.receiverPhone}
            </p>
            <p className="font-bold">{data.buyerInfo?.deliveryAddress}</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <section className="mx-4 my-2 text-sm">
      <dialog id="modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cập nhật trạng thái đơn hàng!</h3>
          <p className="py-4">
            Bạn chắc chắn muốn cập nhật trạng thái đơn hàng này thành{' '}
            {selectedOrder?.status === 'TO_SHIP' ? '"Đang giao hàng"' : '"Đã giao thành công"'}{' '}
          </p>
          <div className="modal-action">
            <div className="flex gap-2">
              <button className="btn btn-primary text-white" onClick={() => updateOrderStatus()}>
                Cập nhật
              </button>
              <button
                className="btn"
                onClick={() => {
                  const dialog = document.getElementById('modal') as HTMLDialogElement
                  dialog.close()
                  setSelectedOrder(null)
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </dialog>
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
              Tất cả ({orders.length})
            </div>
            <div
              role="tab"
              className={`tab ${
                activeTab === 'TO_SHIP' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
              }`}
              onClick={() => handleTabClick('TO_SHIP')}
            >
              Chờ vận chuyển ({orders.filter((order: OrderItem) => order.status === 'TO_SHIP').length})
            </div>
            <div
              role="tab"
              className={`tab ${
                activeTab === 'SHIPPING' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
              }`}
              onClick={() => handleTabClick('SHIPPING')}
            >
              Đang giao ({orders.filter((order: OrderItem) => order.status === 'SHIPPING').length})
            </div>
            <div
              role="tab"
              className={`tab ${
                activeTab === 'COMPLETED' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
              }`}
              onClick={() => handleTabClick('COMPLETED')}
            >
              Đã hoàn thành ({orders.filter((order: OrderItem) => order.status === 'COMPLETED').length})
            </div>
            <div
              role="tab"
              onClick={() => handleTabClick('CANCELLED')}
              className={`tab ${
                activeTab === 'CANCELLED' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
              }`}
            >
              Đã hủy ({orders.filter((order: OrderItem) => order.status === 'CANCELLED').length})
            </div>

            <div
              role="tab"
              onClick={() => handleTabClick('REFUNDED')}
              className={`tab ${
                activeTab === 'REFUNDED' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
              }`}
            >
              Hoàn tiền ({orders.filter((order: OrderItem) => order.status === 'REFUNDED').length})
            </div>
            <div
              role="tab"
              onClick={() => handleTabClick('FAILED_DELIVERY')}
              className={`tab ${
                activeTab === 'FAILED_DELIVERY' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
              }`}
            >
              Thất bại ({orders.filter((order: OrderItem) => order.status === 'FAILED_DELIVERY').length})
            </div>
          </div>

          <div className="m-4">
            <DataTable
              title={
                <div className="md:flex justify-between">
                  <p className="md:text-xl text-base">DANH SÁCH TẤT CẢ ĐƠN HÀNG CỦA SHOP</p>
                  <div className="flex gap-2 my-2 lg:my-0">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Tìm kiếm đơn hàng..."
                        className="input input-bordered"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button onClick={exportToCSV} className="btn btn-sm btn-outline btn-primary">
                        Xuất báo cáo
                      </button>
                    </div>
                  </div>
                </div>
              }
              columns={columns}
              data={filteredOrders}
              progressPending={isLoadingOrders}
              expandableRows
              expandableRowsComponent={ExpandedComponent}
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
