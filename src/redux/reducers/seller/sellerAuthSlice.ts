import { LoginData } from '@/types/user.type'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store'

export type AuthState = LoginData

const initialState: AuthState = {
  accessToken: '',
  user: {
    id: '',
    fullName: '',
    email: '',
    phone: '',
    avatar: '',
    birthday: '',
    status: true,
    gender: '',
    role: '',
    emailConfirmed: false,
  },
  refreshToken: '',
}

const sellerAuthSlice = createSlice({
  name: 'sellerAuth',
  initialState: {
    authData: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.authData.accessToken = action.payload.accessToken
      state.authData.user = action.payload.user
      state.authData.refreshToken = action.payload.refreshToken
    },
    removeAuth: (state) => {
      state.authData = initialState
    },
  },
})

export const selectSellerAuth = (state: RootState) => state.sellerAuth

export const { addAuth, removeAuth } = sellerAuthSlice.actions
export default sellerAuthSlice.reducer
