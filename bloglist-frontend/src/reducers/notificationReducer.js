import { createSlice } from '@reduxjs/toolkit'

const notifSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    notifChange(state, action) {
      return action.payload
    },
  },
})

export const { notifChange } = notifSlice.actions

export const setNotification = (msg, type, time) => {
  return async (dispatch) => {
    dispatch(notifChange({message:msg,type:type}))
    setTimeout(() => {
      dispatch(notifChange(null))
    }, time * 1000)
  }
}
export default notifSlice.reducer
