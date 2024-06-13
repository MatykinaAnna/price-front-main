import { createSlice } from '@reduxjs/toolkit'
import { loadPriceItems, loadPriceResults, loadCategory } from './thunks'
import { PriceItem, PriceResultItem } from 'shared/interfaces'
import { stat } from 'fs'
import { clear } from 'console'

interface serviceState {
  allPriceItem: PriceItem[]
  activeServiceId: number
  allPriceResultItem: PriceResultItem[]
  allCategory: {
    id: number
    order_num: number
    name: string
  }[]
  loadCategoryFulfilled: boolean
  price_result: Price
  activeArticleUnitItem: number | null

  redClass: { articleId: number; periodId: number }[]
}

interface Price {
  id: number
  date_since: string
  is_draft: number
  staff_id: string
  timestamp: string
  price_items: {
    article_unit_item_id: number
    price_results: {
      value: number
      staff_id: number
      is_last: number
      complex_item_id: null | number
      division_id: number
    }[]
  }[]
}

const serviceReducer = createSlice({
  name: 'serviceReducer',
  initialState: {
    redClass: [],
    allPriceItem: [],
    activeServiceId: -1,
    allPriceResultItem: [],
    allCategory: [],
    loadCategoryFulfilled: false,
    price_result: {
      id: -1,
      date_since: '',
      is_draft: -1,
      staff_id: '',
      timestamp: '',
      price_items: [],
    },
    activeArticleUnitItem: null,
  } as serviceState,
  reducers: {
    setRedClass(
      state,
      action: { payload: { articleId: number; periodId: number } }
    ) {
      state.redClass.push(action.payload)
    },

    clearSetRedClass(state) {
      state.redClass = []
    },

    clearAllPriceResultItem(state) {
      state.allPriceResultItem = []
    },

    setActiveServiceId(state, action) {
      state.activeServiceId = action.payload
    },

    setInfForPriceRes(
      state,
      action: {
        payload: {
          id: number
          date_since: string
          is_draft: number
          staff_id: string
          timestamp: string
        }
      }
    ) {
      state.price_result.id = action.payload.id
      state.price_result.date_since = action.payload.date_since
      state.price_result.is_draft = action.payload.is_draft
      state.price_result.staff_id = action.payload.staff_id
      state.price_result.timestamp = action.payload.timestamp
    },
    addPriceItems(
      state,
      action: {
        payload: {
          article_unit_item_id: number
          price_results: {
            value: number
            staff_id: number
            is_last: number
            complex_item_id: null | number
            division_id: number
          }[]
        }
      }
    ) {
      state.price_result.price_items.push(action.payload)
    },

    setActiveArticleUnitItem(state, action) {
      state.activeArticleUnitItem = action.payload
    },
    updatePriceValue(
      state,
      action: { payload: { article_unit_item_id: number; value: number } }
    ) {
      let ind = state.price_result.price_items.findIndex((item) => {
        return item.article_unit_item_id === action.payload.article_unit_item_id
      })
      state.price_result.price_items[ind].price_results[0].value =
        action.payload.value
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadPriceItems.fulfilled,
      (state, action: { payload: PriceItem[] }) => {
        state.allPriceItem = action.payload
      }
    )

    builder.addCase(loadPriceResults.fulfilled, (state, action) => {
      // @ts-ignore
      state.allPriceResultItem = action.payload.price_results
    })

    builder.addCase(loadCategory.pending, (state, action) => {
      state.loadCategoryFulfilled = false
    })
    builder.addCase(loadCategory.fulfilled, (state, action) => {
      // @ts-ignore
      state.allCategory = action.payload.Category
      state.loadCategoryFulfilled = true
    })
  },
})

export default serviceReducer.reducer
export const {
  clearAllPriceResultItem,
  setInfForPriceRes,
  addPriceItems,
  updatePriceValue,
  setActiveArticleUnitItem,
  setActiveServiceId,
  setRedClass,
  clearSetRedClass,
} = serviceReducer.actions
