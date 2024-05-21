import { LoginData } from '@/types/user.type'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

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
    setToken: (state, action) => {
      state.authData.accessToken = action.payload
    },
    removeAuth: (state) => {
      state.authData = initialState
    },
    updateProfile: (state, action) => {
      state.authData.user = action.payload
    },
  },
})

export const selectAuth = (state: RootState) => state.auth

export const { addAuth, setToken, removeAuth, updateProfile } = authSlice.actions
export default authSlice.reducer
