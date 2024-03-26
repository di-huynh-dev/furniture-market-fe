import { LoginType } from '@/types/user.type'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

export type AuthState = LoginType

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
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.authData.accessToken = action.payload.accessToken
      state.authData.user = action.payload.user
    },
    removeAuth: (state) => {
      state.authData = initialState
    },
  },
})

export const selectAuth = (state: RootState) => state.auth

export const { addAuth, removeAuth } = authSlice.actions
export default authSlice.reducer
