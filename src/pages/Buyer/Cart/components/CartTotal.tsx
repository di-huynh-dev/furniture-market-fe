import { LoadingComponent } from '@/components'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { selectAuth } from '@/redux/reducers/authSlice'
import { selectCart } from '@/redux/reducers/buyer/cartSlice'
import { formatPrice } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const CartTotal = () => {
  const cart = useSelector(selectCart)
  const navigation = useNavigate()
  const user = useSelector(selectAuth)
  const axiosPrivate = useAxiosBuyerPrivate()

  const { data: addresses, isLoading: isLoadingAddress } = useQuery({
    queryKey: [Buyer_QueryKeys.USER_ADDRESS],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/buyer/delivery-address')
      return resp.data.data
    },
    enabled: !!user.authData.accessToken,
  })

  const handleCheckoutClick = () => {
    if (!addresses.defaultAddressId) {
      toast.error('Vui lòng cung cấp địa chỉ giao hàng!')
      navigation('/buyer/account/address')
    } else {
      navigation('/buyer/checkout')
    }
  }

  if (isLoadingAddress) {
    return <LoadingComponent />
  }
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
        <div className="mt-2">
          {user.authData.accessToken ? (
            <div onClick={handleCheckoutClick} className="btn btn-round w-full bg-primary text-white">
              Đặt hàng
            </div>
          ) : (
            <Link to="/buyer/login" className="btn btn-primary btn-block mt-8 text-white">
              Vui lòng đăng nhập
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartTotal
