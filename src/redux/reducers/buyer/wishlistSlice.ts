import { RootState } from '@/redux/store'
import { WishlistType } from '@/types/wishlist.type'
import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState: WishlistType = {
  wishlistItemList: [],
  wishlistTotalQuantity: 0,
}
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addItemToWishlist: (state, action) => {
      if (action.payload) {
        const item = state.wishlistItemList.find((i) => i.id === action.payload.id)
        if (item) {
          toast.info('Sản phẩm đã tồn tại trong wishlist!')
        } else {
          const tempProductItem = { ...action.payload, wishlistQuantity: 1 }
          state.wishlistItemList.push(tempProductItem)
          state.wishlistTotalQuantity += tempProductItem.wishlistQuantity
          toast.success('Sản phẩm đã được thêm vào wishlist!')
        }

        localStorage.setItem('wishlistItems', JSON.stringify(state.wishlistItemList))
      }
    },
    getTotalsWishlist: (state) => {
      const { wishlistItemList } = state
      const { quantity } = wishlistItemList.reduce(
        (wishlistTotal, wishlistItem) => {
          const { wishlistQuantity } = wishlistItem
          wishlistTotal.quantity += wishlistQuantity
          return wishlistTotal
        },
        { total: 0, quantity: 0 },
      )

      state.wishlistTotalQuantity = quantity
    },
  },
})

export const selectWishlist = (state: RootState) => state.wishlist
export const { addItemToWishlist, getTotalsWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
