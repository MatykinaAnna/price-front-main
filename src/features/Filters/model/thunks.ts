import { apiInstance } from '../../../shared/axios-instance'
import { createAsyncThunk } from '@reduxjs/toolkit'

const loadDivisions = createAsyncThunk(
  'divisionsReducer/loadDivisions',
  async (payload: { company_group_id: number }) => {
    const listDivisions = await apiInstance({
      method: 'get',
      url: `/api/v1/price_list/divisions/?company_group_id=${payload.company_group_id}`,
    }).then((res) => {
      return res.data
    })
    return listDivisions
  }
)

export { loadDivisions }
