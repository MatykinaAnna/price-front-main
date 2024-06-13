import { createSlice } from '@reduxjs/toolkit'
import { loadDivisions } from './thunks'
import { DivisionsItem } from 'shared/interfaces'

interface periodState {
  allDivisions: DivisionsItem[]
  activeDivisions: number | null
}

const divisionReducer = createSlice({
  name: 'periodReducer',
  initialState: {
    allDivisions: [],
    activeDivisions: null,
  } as periodState,
  reducers: {
    setAllPeriod(state, action: { payload: DivisionsItem[] }) {
      state.allDivisions = []
      action.payload.forEach((item) => {
        state.allDivisions.push(item)
      })
    },
    setActiveDivisions(state, action: { payload: number }) {
      state.activeDivisions = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadDivisions.fulfilled,
      (state, action: { payload: DivisionsItem[] }) => {
        state.allDivisions = action.payload
      }
    )
  },
})

export default divisionReducer.reducer
export const { setAllPeriod, setActiveDivisions } = divisionReducer.actions
