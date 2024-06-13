import { createSlice } from '@reduxjs/toolkit'

interface DropdownState {
  nameRegion: string
  nameCity: string
  nameDc: string
}

const DropdownReducer = createSlice({
  name: 'DropdownReducer',
  initialState: {} as DropdownState,
  reducers: {
    setNameRegion(state, action) {
      state.nameRegion = action.payload
    },
    setNameCity(state, action) {
      state.nameCity = action.payload
    },
    setNameDc(state, action) {
      state.nameDc = action.payload
    },
  },
})

export default DropdownReducer.reducer
export const { setNameRegion, setNameCity, setNameDc } = DropdownReducer.actions
