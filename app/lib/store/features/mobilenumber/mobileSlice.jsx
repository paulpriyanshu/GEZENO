import { createSlice } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state


// Define the initial state using that type
const initialState = {
  number:"",
  email:"",
  name:""
}

export const numberSlice = createSlice({
  name: 'number',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addNumber:(state,action)=>{
        state.number=action.payload
       
    },
    addEmail:(state,action)=>{
        state.email=action.payload
    },
    addName:(state,action)=>{
      state.name=action.payload
    }
  },
})

export const { addNumber,addEmail,addName } = numberSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state) => state.counter.value

export default numberSlice.reducer