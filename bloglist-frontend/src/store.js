import blogReducer from './reducers/blogReducer'
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/loginReducer'
import notifReducer from './reducers/notificationReducer'
import usersReducer from './reducers/usersReducer'
const store = configureStore({
  reducer: {
    blogs: blogReducer,
    user: userReducer,
    notification: notifReducer,
    users: usersReducer,
  },
})

export default store
