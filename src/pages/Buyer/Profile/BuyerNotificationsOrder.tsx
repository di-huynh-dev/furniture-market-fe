import Notify from './components/Notify'

const BuyerNotificationsOrder = () => {
  return (
    <div className="m-2">
      <Notify
        title="Đơn hàng đã được xác nhận bởi VN shop"
        content="Đơn hàng đã được chuyển đổi sang đơn hàng đã được xác nhận. Hãy xem thông tin chi tiết và theo dõi đơn hàng của bạn"
        time="30/10/2022"
      />
      <Notify
        title="Đơn hàng đã được xác nhận bởi VN shop"
        content="Đơn hàng đã được chuyển đổi sang đơn hàng đã được xác nhận"
        time="30/10/2022"
      />
    </div>
  )
}

export default BuyerNotificationsOrder
