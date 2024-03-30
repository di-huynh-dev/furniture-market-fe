import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'
import sellerAuthReducer from './reducers/seller/sellerAuthSlice'

export const store = configureStore({
  reducer: { auth: authReducer, sellerAuth: sellerAuthReducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
