import { createSlice } from '@reduxjs/toolkit';

enum Btn {
  'none' = 0,
  'save' = 1,
  'del' = 2,
}

export interface confirmReducerData {
  text: string;
  openConfirmReducer: boolean | null;
  result: boolean;
  btn: Btn;
}

const confirmReducer = createSlice({
  name: 'confirmReducer',
  initialState: {
    text: '',
    openConfirmReducer: null,
    result: false,
    btn: 0,
  } as confirmReducerData,
  reducers: {
    setOpenConfirmReducer(state, action) {
      state.openConfirmReducer = action.payload;
    },
    setText(state, action) {
      state.text = action.payload;
    },
    setResult(state, action) {
      state.result = action.payload;
    },
    setBtn(state, action: { payload: Btn }) {
      state.btn = action.payload;
    },
  },
  extraReducers: (builder) => {},
});
export default confirmReducer.reducer;
export const { setOpenConfirmReducer, setText, setResult, setBtn } =
  confirmReducer.actions;
