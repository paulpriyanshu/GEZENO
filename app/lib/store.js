import { configureStore } from '@reduxjs/toolkit'
import { numberSlice } from './store/features/mobilenumber/mobileSlice'
import sidebarReducer from './store/features/adminsidebar/SideBarSlice'
import homesidebarReducer from './store/features/homesidebar/HomeSideBarSlice'
import mobilesearchReducer from './store/features/mobilesearchbar/mobilesearchslice'
// import {numberReducer} from './store/features/mobilenumber/mobileSlice'
export const makeStore = () => {
  return configureStore({
    reducer: {
        number: numberSlice.reducer,
        sidebar: sidebarReducer,
        homesidebar:homesidebarReducer,
        mobilesearch:mobilesearchReducer
    },
  })
}
