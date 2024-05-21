import { clearCart, getTotals, selectCart } from '@/redux/reducers/buyer/cartSlice'
import { useSelector } from 'react-redux'
import image from '@/assets/images/no-item.jpg'
import CartItemComponent from './CartItemComponent'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { IoIosArrowForward } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { CartType } from '@/types/cart.type'

const CartItemList = () => {
  const cart: CartType = useSelector(selectCart)
  const navigation = useNavigate()

  const dispatch = useDispatch()
  const handleDeleteAll = () => {
    dispatch(clearCart())
    dispatch(getTotals())
    toast.success('Đã xóa tất cả sản phẩm!')
  }
  return (
    <div className="">
      {cart.cartItemList.length === 0 ? (
        <div className="flex flex-col items-center lg:text-xl text-sm py-10">
          <img src={image} alt="Giỏ hàng trống" className="w-1/3 h-1/3" />
          <p className="font-bold">Giỏ hàng trống!</p>
          <p>Hãy tiếp tục mua sắm thoải mái bạn nhé!</p>
        </div>
      ) : (
        <>
          {cart.cartItemList.map((item) => (
            <div className="card py-4 bg-base-100 shadow-sm m-2 lg:px-10 px-4">
              <button onClick={() => navigation(`/shop/${item.storeInfo.id}`)}>
                <div className="flex gap-2 items-center mb-4">
                  <img src={item.storeInfo.logo} alt="Logo shop" className="w-12 h-12 object-cover rounded-full" />
                  <p className="text-lg font-bold uppercase">{item.storeInfo.shopName}</p>
                  <IoIosArrowForward />
                </div>
              </button>
              {item.items.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
            </div>
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
