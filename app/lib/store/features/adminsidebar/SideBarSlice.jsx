import { createSlice } from '@reduxjs/toolkit'

// Initial state for the sidebar
const initialState = {
  isOpen: false, // Sidebar is closed by default
}

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.isOpen = true // Opens the sidebar
    },
    closeSidebar: (state) => {
      state.isOpen = false // Closes the sidebar
    },
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen // Toggles the sidebar state
    },
  },
})

// Export the actions
export const { openSidebar, closeSidebar, toggleSidebar } = sidebarSlice.actions

// Export the reducer
export default sidebarSlice.reducer
