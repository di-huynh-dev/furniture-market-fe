import { selectAuth } from '@/redux/reducers/authSlice'
import { selectCart } from '@/redux/reducers/buyer/cartSlice'
import { formatPrice } from '@/utils/helpers'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const CartTotal = () => {
  const cart = useSelector(selectCart)
  const user = useSelector(selectAuth)

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <span className="text-xl font-bold">Tóm tắt đơn hàng</span>
        <p className="flex justify-between text-sm mt-2 py-4 border-t-2">
          <span className="font-bold text-sm">Tạm tính</span>
          <span className="text-sm font-bold">{formatPrice(cart.cartTotalAmount)}</span>
        </p>
      </div>
      <div className="mt-2">
        {user.authData.accessToken ? (
          <Link to="/buyer/checkout">
            <div className="btn btn-round w-full bg-primary text-white">Đặt hàng</div>
          </Link>
        ) : (
          <Link to="/buyer/login" className="btn btn-primary btn-block mt-8 text-white">
            Vui lòng đăng nhập
          </Link>
        )}
      </div>
    </div>
  )
}

export default CartTotal
