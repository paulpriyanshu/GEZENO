'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from './lib/store'
import { addNumber } from './lib/store/features/mobilenumber/mobileSlice'

export default function StoreProvider({ children }) {
  const storeRef = useRef()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()

  }

  return <Provider store={storeRef.current}>{children}</Provider>
}