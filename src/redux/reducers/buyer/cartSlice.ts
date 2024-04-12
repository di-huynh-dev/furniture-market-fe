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
    decreaseCart(state, action) {
      const itemIndex = state.cartItemList.findIndex((item) => item.id === action.payload.id)

      if (state.cartItemList[itemIndex].cartQuantity > 1) {
        state.cartItemList = state.cartItemList.map((item) =>
          item.id === action.payload.id ? { ...item, cartQuantity: item.cartQuantity - 1 } : item,
        )
        toast.info('Số lượng sản phẩm đã được cập nhật!')
      } else if (state.cartItemList[itemIndex].cartQuantity === 1) {
        const nextcartItemList = state.cartItemList.filter((item) => item.id !== action.payload.id)
        state.cartItemList = nextcartItemList
        toast.error('Sản phẩm đã được xóa!')
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItemList))
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
    removeFromCart(state, action) {
      state.cartItemList.map((cartItem) => {
        if (cartItem.id === action.payload.id) {
          const nextCartItems = state.cartItemList.filter((item) => item.id !== cartItem.id)

          state.cartItemList = nextCartItems
          toast.success('Xóa sản phẩm thành công')
        }
        localStorage.setItem('cartItems', JSON.stringify(state.cartItemList))
        return state
      })
    },
    clearCart(state) {
      state.cartItemList = []
      state.cartTotalQuantity = 0
      state.cartTotalAmount = 0
      state.shipping = 0
      state.discountCode = ''
      localStorage.setItem('cartItems', JSON.stringify(state.cartItemList))
    },
  },
})

export const selectCart = (state: RootState) => state.cart
export const { addToCart, getTotals, decreaseCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
