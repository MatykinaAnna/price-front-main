import { apiInstance } from '../../../../shared/axios-instance'
import { createAsyncThunk } from '@reduxjs/toolkit'

const loadPeriod = createAsyncThunk(
  'periodReducer/loadPeriod',
  async (payload: { company_group_id: number; price_type_id: number }) => {
    const listPeriod = await apiInstance({
      method: 'get',
      url: `/api/v1/price_list/periods/?company_group_id=${payload.company_group_id}&price_type_id=${payload.price_type_id}`,
    }).then((res) => {
      return res.data
    })
    return listPeriod
  }
)

export { loadPeriod }
