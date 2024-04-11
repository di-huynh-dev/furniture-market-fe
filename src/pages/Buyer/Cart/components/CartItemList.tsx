import { clearCart, selectCart } from '@/redux/reducers/buyer/cartSlice'
import { useSelector } from 'react-redux'
import image from '@/assets/images/no-item.jpg'
import CartItemComponent from './CartItemComponent'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
const CartItemList = () => {
  const cart = useSelector(selectCart)
  const dispatch = useDispatch()
  const handleDeleteAll = () => {
    dispatch(clearCart())
    toast.success('Đã xóa tất cả sản phẩm!')
  }
  return (
    <div className="card py-4 bg-base-100 shadow-sm mx-2 lg:px-10 px-4">
      {cart.cartItemList.length === 0 ? (
        <div className="flex flex-col items-center lg:text-xl text-sm py-10">
          <img src={image} alt="Giỏ hàng trống" className="w-1/2 h-1/2" />
          <p className="font-bold">Giỏ hàng trống!</p>
          <p>Hãy tiếp tục mua sắm thoải mái bạn nhé!</p>
        </div>
      ) : (
        <>
          {cart.cartItemList.map((item) => (
            <CartItemComponent item={item} key={item.id} />
          ))}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
            <button className="btn btn-ghost btn-info">Khám phá ngay</button>
            <button
              className="btn btn-ghost btn-primary"
              onClick={() => {
                handleDeleteAll()
              }}
            >
              Xóa tất cả
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default CartItemList
