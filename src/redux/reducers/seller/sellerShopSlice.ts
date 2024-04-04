import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { ShopInfoType } from '@/types/shop-info.type'

export type ShopState = ShopInfoType

const initialState: ShopState = {
  shopInfo: {
    shopName: '',
    ownerName: '',
    address: '',
    logo: '',
    description: '',
    tax: ['', ''],
    identifier: ['', '', '', ''],
    breakStatus: false,
    nfollower: 0,
    topBanner: '',
    infoBanner: '',
  },
}

const sellerShopSlice = createSlice({
  name: 'sellerShop',
  initialState: {
    shopData: initialState,
  },
  reducers: {
    addShopInfo: (state, action) => {
      state.shopData.shopInfo = action.payload
    },
  },
})

export const selectSellerShop = (state: RootState) => state.sellerShop
export const { addShopInfo } = sellerShopSlice.actions
export default sellerShopSlice.reducer
