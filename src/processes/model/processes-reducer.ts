import { createSlice } from '@reduxjs/toolkit'

const publicReducer = createSlice({
  name: 'settingsmReducer',
  initialState: {
    activeWindow5: false,
  },
  reducers: {
    setActiveWindow5(state, actions) {
      state.activeWindow5 = actions.payload
    },
  },
  extraReducers: (builder) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    builder
  },
})

export default publicReducer.reducer
export const { setActiveWindow5 } = publicReducer.actions
