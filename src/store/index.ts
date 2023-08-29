import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'
import { useDispatch } from 'react-redux'

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleWare) => getDefaultMiddleWare({
        serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>
export default store