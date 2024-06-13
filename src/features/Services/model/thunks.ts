import { apiInstance } from '../../../shared/axios-instance'
import { createAsyncThunk } from '@reduxjs/toolkit'

const loadPriceItems = createAsyncThunk(
  'serviceReducer/PriceItems',
  async (payload: {
    company_group_id: number
    language_id: number
    price_type_id: number
  }) => {
    const listPriceItems = await apiInstance({
      method: 'get',
      url: `/api/v1/price_list/price_item/?company_group_id=${payload.company_group_id}&language_id=${payload.language_id}&price_type_id=${payload.price_type_id}`,
    }).then((res) => {
      return res.data
    })
    return listPriceItems
  }
)

const loadPriceResults = createAsyncThunk(
  'serviceReducer/PriceResults',
  async (payload: { division_id: number; price_list_result_id: number }) => {
    const listPriceResults = await apiInstance({
      method: 'get',
      url: `/api/v1/price_list/price/?division_id=${payload.division_id}&price_list_result_id=${payload.price_list_result_id}`,
    }).then((res) => {
      return res.data
    })
    return listPriceResults
  }
)

const loadCategory = createAsyncThunk('serviceReducer/Category', async () => {
  const Category = await apiInstance({
    method: 'get',
    url: `/api/v1/category/`,
  }).then((res) => {
    return res.data
  })
  return {
    Category,
  }
})

export { loadPriceItems, loadPriceResults, loadCategory }
