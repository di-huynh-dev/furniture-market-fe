import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './reducers/authSlice'
import sellerAuthReducer from './reducers/seller/sellerAuthSlice'
import sellerShopReducer from './reducers/seller/sellerShopSlice'
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE } from 'redux-persist'

const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['loading', 'error'],
}

const sellerAuthPersistConfig = {
  key: 'sellerAuth',
  storage,
  blacklist: ['loading', 'error'],
}

const sellerShopPersistConfig = {
  key: 'sellerShop',
  storage,
  blacklist: ['loading', 'error'],
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)

const persistedSellerAuthReducer = persistReducer(sellerAuthPersistConfig, sellerAuthReducer)

const persistedSellerShopReducer = persistReducer(sellerShopPersistConfig, sellerShopReducer)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    sellerAuth: persistedSellerAuthReducer,
    sellerShop: persistedSellerShopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
