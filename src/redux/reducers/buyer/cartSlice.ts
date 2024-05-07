import { RootState } from '@/redux/store'
import { CartItem, CartType } from '@/types/cart.type'
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
      const payload = action.payload
      if (payload) {
        const cartQuantity = payload.quantity !== undefined ? payload.quantity : 1
        const item = state.cartItemList
          .find((i) => i.storeInfo.id === payload.storeInfo.id)
          ?.items.find((i) => i.id === payload.id)

        if (item) {
          item.cartQuantity += cartQuantity
          toast.info('Số lượng sản phẩm đã được cập nhật!')
        } else {
          const tempProductItem: CartItem = { ...payload, cartQuantity }

          const storeCartItemsIndex = state.cartItemList.findIndex((item) => item.storeInfo.id === payload.storeInfo.id)
          if (storeCartItemsIndex !== -1) {
            state.cartItemList[storeCartItemsIndex].items.push(tempProductItem)
          } else {
            state.cartItemList.push({
              storeInfo: payload.storeInfo,
              items: [tempProductItem],
            })
          }

          toast.success('Sản phẩm đã được thêm vào giỏ hàng!')
        }

        localStorage.setItem('cartItems', JSON.stringify(state.cartItemList))
      }
    },
    decreaseCart: (state, action) => {
      const { productId, storeId } = action.payload
      const storeIndex = state.cartItemList.findIndex((store) => store.storeInfo.id === storeId)

      if (storeIndex !== -1) {
        const itemIndex = state.cartItemList[storeIndex].items.findIndex((item) => item.id === productId)
        if (itemIndex !== -1) {
          const cartItem = state.cartItemList[storeIndex].items[itemIndex]
          if (cartItem.cartQuantity > 1) {
            cartItem.cartQuantity--
            toast.info('Số lượng sản phẩm đã được cập nhật!')
          } else {
            state.cartItemList[storeIndex].items.splice(itemIndex, 1)
            // Nếu danh sách sản phẩm của cửa hàng trống sau khi xóa, hãy xóa cửa hàng đó khỏi giỏ hàng
            if (state.cartItemList[storeIndex].items.length === 0) {
              state.cartItemList.splice(storeIndex, 1)
            }
            toast.error('Sản phẩm đã được xóa khỏi giỏ hàng!')
          }
          localStorage.setItem('cartItems', JSON.stringify(state.cartItemList))
        }
      }
    },
    getTotals: (state) => {
      let total = 0
      let quantity = 0

      state.cartItemList.forEach((store) => {
        store.items.forEach((item) => {
          const { onSale, price, salePrice, cartQuantity } = item
          const itemTotal = onSale ? salePrice * cartQuantity : price * cartQuantity
          total += itemTotal
          quantity += cartQuantity
        })
      })

      state.cartTotalQuantity = quantity
      state.cartTotalAmount = parseFloat(total.toFixed(2))
      state.shipping = 0
      state.discountCode = ''
      state.discount = 0
    },
    removeFromCart: (state, action) => {
      const { productId, storeId } = action.payload
      const storeIndex = state.cartItemList.findIndex((store) => store.storeInfo.id === storeId)

      if (storeIndex !== -1) {
        state.cartItemList[storeIndex].items = state.cartItemList[storeIndex].items.filter(
          (item) => item.id !== productId,
        )

        // Nếu danh sách sản phẩm của cửa hàng trống sau khi xóa, hãy xóa cửa hàng đó khỏi giỏ hàng
        if (state.cartItemList[storeIndex].items.length === 0) {
          state.cartItemList.splice(storeIndex, 1)
        }

        toast.success('Xóa sản phẩm khỏi giỏ hàng thành công')
        localStorage.setItem('cartItems', JSON.stringify(state.cartItemList))
      } else {
        toast.error('Không tìm thấy cửa hàng chứa sản phẩm này trong giỏ hàng')
      }
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
