import { RootState } from '@/redux/store'
import { CartType } from '@/types/cart.type'
import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: CartType = {
  cartItemList: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  shipping: 0,
  discountCode: '',
  discount: 0,
}
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      if (action.payload) {
        const cartQuantity = action.payload.quantity !== undefined ? action.payload.quantity : 1
        const item = state.cartItemList.find((i) => i.id === action.payload.id)

        if (item) {
          item.cartQuantity += cartQuantity
          toast.info('Số lượng sản phẩm đã được cập nhật!')
        } else {
          const tempProductItem = { ...action.payload, cartQuantity: cartQuantity }
          state.cartItemList.push(tempProductItem)
          toast.success('Sản phẩm đã được thêm vào giỏ hàng!')
        }

        localStorage.setItem('cartItems', JSON.stringify(state.cartItemList))
      }
    },
    getTotals: (state) => {
      const { cartItemList } = state
      const { total, quantity } = cartItemList.reduce(
        (cartTotal, cartItem) => {
          const { onSale, price, salePrice, cartQuantity } = cartItem
          const itemTotal = onSale ? salePrice * cartQuantity : price * cartQuantity
          cartTotal.total += itemTotal
          cartTotal.quantity += cartQuantity
          return cartTotal
        },
        { total: 0, quantity: 0 },
      )

      state.cartTotalQuantity = quantity
      state.cartTotalAmount = parseFloat(total.toFixed(2))
      state.shipping = 0
      state.discountCode = ''
      state.discount = 0
    },
  },
})

export const selectCart = (state: RootState) => state.cart
export const { addToCart, getTotals } = cartSlice.actions
export default cartSlice.reducer
