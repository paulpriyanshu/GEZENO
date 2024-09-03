import { configureStore } from '@reduxjs/toolkit'
import { numberSlice } from './store/features/mobilenumber/mobileSlice'
// import {numberReducer} from './store/features/mobilenumber/mobileSlice'
export const makeStore = () => {
  return configureStore({
    reducer: {
        number: numberSlice.reducer
    },
  })
}
