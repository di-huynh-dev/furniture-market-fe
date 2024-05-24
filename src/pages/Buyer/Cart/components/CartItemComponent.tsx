import React from 'react'
import { CartItem } from '@/types/cart.type'
import { CiCircleRemove } from 'react-icons/ci'
import { formatPrice } from '@/utils/helpers'
import { useDispatch } from 'react-redux'
import { addToCart, decreaseCart, getTotals, removeFromCart } from '@/redux/reducers/buyer/cartSlice'

const CartItemComponent: React.FC<{ item: CartItem }> = ({ item }) => {
  const dispatch = useDispatch()

  const handleDecrease = (item: CartItem) => {
    dispatch(decreaseCart({ productId: item.id, storeId: item.storeInfo.id }))
    dispatch(getTotals())
  }

  const handleIncrease = (item: CartItem) => {
    dispatch(addToCart(item))
    dispatch(getTotals())
  }

  const removeItemFromTheCart = (item: CartItem) => {
    dispatch(removeFromCart({ productId: item.id, storeId: item.storeInfo.id }))
    dispatch(getTotals())
  }

  return (
    <div className="flex space-x-3 w-full mb-10 border-b border-base-300 pb-6 last:border-b-0">
      <img src={item.thumbnail} alt={item.name} className="lg:h-24 lg:w-24 h-12 w-12 rounded-lg object-cover" />
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
          <div className="flex-1">
            <p className="font-bold">{item.name}</p>
            <div className="mt-2 grid grid-cols-10  items-center gap-1 text-sm">
              <p className="font-bold col-span-2">Chất liệu:</p>
              <p className="col-span-8">{item.material}</p>
            </div>
            <div className="mt-2 grid grid-cols-10 items-center gap-1 text-sm">
              <p className="font-bold col-span-2">Kích thước:</p>
              <p className="text-sm col-span-8">
                {item.width} cm x {item.height} cm x {item.length} cm
              </p>
            </div>
            <div className="mt-2 grid grid-cols-10 items-center gap-1 text-sm">
              <p className="font-bold col-span-2">Trọng lượng:</p>

              <p className="text-sm col-span-8">{item.weight} gram</p>
            </div>
          </div>
          <div className="mt-2 flex lg:items-center space-x-2 flex-col-reverse">
            {item.salePrice ? (
              <>
                <div className="lg:text-xl text-sm text-secondary font-semibold">
                  Tổng: {formatPrice(item.salePrice * item.cartQuantity)}
                </div>
                <div className="text-sm flex gap-2">
                  <div className="hidden md:block">Giá: {formatPrice(item.price)}</div>
                  <div className="line-through"> {formatPrice(item.salePrice)}</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl text-secondary font-semibold">
                  {formatPrice(item.price * item.cartQuantity)}
                </div>
                <div className="text-sm flex gap-2">
                  <div className="">Giá: {formatPrice(item.price)}</div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-2 md:flex md:items-center md:justify-between">
          <div className="sm:ml-12">
            {/* AMOUNT */}
            <div className="flex items-center border-gray-100">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  handleDecrease(item)
                }}
              >
                -
              </button>
              <input
                className="h-10 w-10 border bg-white text-center text-xs outline-none rounded-lg"
                type="text"
                value={item.cartQuantity}
                min="1"
              />
              <button
                className="btn btn-ghost"
                onClick={() => {
                  handleIncrease(item)
                }}
              >
                +
              </button>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={() => removeItemFromTheCart(item)}>
            Xóa
            <CiCircleRemove className="w-[30px] h-[30px]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItemComponent
