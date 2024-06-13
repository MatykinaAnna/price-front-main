import { createSlice } from '@reduxjs/toolkit'
import { loadPeriod } from './thunks'
import { PeriodItem } from 'shared/interfaces'
import { addPriceItems } from 'features/Services'

interface periodState {
  allPeriod: PeriodItem[]
  activePeriodId: number | null
  resultWindow: boolean
  resultWindowHeader: string
  resultWindowStr: string
  resultWindowError: boolean
}

const periodReducer = createSlice({
  name: 'periodReducer',
  initialState: {
    allPeriod: [],
    activePeriodId: null,
    resultWindow: false,
    resultWindowHeader: '',
    resultWindowStr: '',
    resultWindowError: false,
  } as periodState,
  reducers: {
    setResultWindow(state, action) {
      state.resultWindow = action.payload
    },
    setResultWindowError(state, action) {
      state.resultWindowError = action.payload
    },
    setResultWindowHeader(state, action) {
      state.resultWindowHeader = action.payload
    },
    setResultWindowStr(state, action) {
      state.resultWindowStr = action.payload
    },
    setAllPeriodId(state, action) {
      let ind = state.allPeriod.findIndex((item) => {
        return item.id === null
      })
      if (ind !== -1) {
        state.allPeriod[ind].id = action.payload
      }
    },
    setAllPeriod(state, action: { payload: PeriodItem[] }) {
      state.allPeriod = []
      action.payload.forEach((item) => {
        state.allPeriod.push(item)
      })
    },
    clearAllPeriodPriceItems(state) {
      state.allPeriod.forEach((item) => {
        item.price_items = []
      })
    },
    setActivePeriodId(state, action: { payload: number | null }) {
      state.activePeriodId = action.payload
    },
    addPeriodItem(state, action: { payload: PeriodItem }) {
      state.allPeriod.push(action.payload)
    },
    setStartDateForP(state, action) {
      let ind = state.allPeriod.findIndex((item) => {
        return item.id === state.activePeriodId
      })
      // let d = new Date(action.payload)
      // d.setDate(d.getDate() + 1)
      // let s = d.toISOString()
      state.allPeriod[ind].date_since = action.payload.substring(0, 10)
      //state.allPeriod[ind].date_since = s.substring(0, 10)
    },

    setEndDateForP(state, action) {
      let ind = state.allPeriod.findIndex((item) => {
        return item.id === state.activePeriodId
      })
      state.allPeriod[ind].date_to = action.payload.substring(0, 10)
    },

    addPrice(state, action) {
      let ind = state.allPeriod.findIndex((item) => {
        return Number(item.id) === Number(action.payload.price_list_result)
      })
      if (ind !== -1) {
        state.allPeriod[ind].price_items.push(action.payload)
      }
    },

    updatePrice(
      state,
      action: {
        payload: {
          id: number
          article_unit_item_id: number
          division_id: number
          value: number
          staff_id: string
          is_last: number
          complex_item_id: number | null
        }
      }
    ) {
      let ind1 = state.allPeriod.findIndex((item) => {
        return item.id === action.payload.id
      })
      let ind2 = state.allPeriod[ind1]?.price_items.findIndex((item1) => {
        return (
          item1.article_unit_item_id === action.payload.article_unit_item_id &&
          item1.price_results[0].is_last === 1
        )
      })
      if (ind1 !== -1 && ind2 !== -1) {
        state.allPeriod[ind1].price_items[ind2].price_results[0].value =
          action.payload.value
      } else if (ind1 !== -1 && ind2 === -1) {
        let d = {
          article_unit_item_id: action.payload.article_unit_item_id,
          price_results: [],
        }
        //@ts-ignore
        d.price_results.push({
          value: action.payload.value,
          staff_id: action.payload.staff_id,
          is_last: action.payload.is_last,
          complex_item_id: action.payload.complex_item_id,
          division_id: action.payload.division_id,
        })
        state.allPeriod[ind1].price_items.push(d)
      }
    },

    setPrice(
      state,
      action: {
        payload: {
          article_unit_item_id: number
          id: number | null
          price_results: {
            value: number
            staff_id: number
            is_last: number
            complex_item_id: number | null
            division_id: number
          }
        }
      }
    ) {
      let ind = state.allPeriod.findIndex((item) => {
        return item.id === action.payload.id
      })

      let indArt = state.allPeriod[ind].price_items.findIndex((item) => {
        return item.article_unit_item_id === action.payload.article_unit_item_id
      })
      if (indArt !== -1) {
        let ind1 = state.allPeriod[ind].price_items[
          indArt
        ].price_results.findIndex((item) => {
          return item.division_id === action.payload.price_results.division_id
        })
        if (ind1 === -1) {
          state.allPeriod[ind].price_items[indArt].price_results.push(
            action.payload.price_results
          )
        } else {
          state.allPeriod[ind].price_items[indArt].price_results[ind1] =
            action.payload.price_results
        }
      } else {
        let v = []
        v.push(action.payload.price_results)
        state.allPeriod[ind].price_items.push({
          article_unit_item_id: action.payload.article_unit_item_id,
          price_results: v,
        })
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadPeriod.fulfilled,
      (state, action: { payload: PeriodItem[] }) => {
        let array = action.payload.map((item) => {
          if (item.price_items === undefined) {
            return { ...item, price_items: [] }
          } else {
            return item
          }
        })

        state.allPeriod = array.sort((a, b) => {
          return Number(a.id) - Number(b.id)
        })
      }
    )
  },
})

export default periodReducer.reducer
export const {
  setAllPeriod,
  setActivePeriodId,
  addPeriodItem,
  setStartDateForP,
  setEndDateForP,
  setPrice,
  addPrice,
  setAllPeriodId,
  clearAllPeriodPriceItems,
  updatePrice,
  setResultWindow,
  setResultWindowHeader,
  setResultWindowStr,
  setResultWindowError,
} = periodReducer.actions
