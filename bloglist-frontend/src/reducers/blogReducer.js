import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    createBlog(state, action) {
      const blog = action.payload
      state.push(blog)
    },
   
    setBlog(state, action) {
      return action.payload
    },
    updateBlog(state, action) {
      const updatedAnecdote = action.payload
      return state.map((a) =>
        a.id !== updatedAnecdote.id ? a : updatedAnecdote
      )
    },
    removeBlog(state, action){
        const id = action.payload
        return state.filter(a => a.id !== id)
    }

  },
})

export const { createBlog, updateBlog, setBlog, removeBlog } =
  blogSlice.actions
export const initializeBlogs = () => {
  return async (dispatch) => {
    dispatch(setBlog(await blogService.getAll()))
  }
}

export const appendBlog = (blog) => {
  return async (dispatch) => {
    dispatch(createBlog(await blogService.create(blog)))
  }
}

export const commentBlog = (id, content) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.createComment(id, content)
    dispatch(updateBlog(updatedBlog)) 
  }
}

export const likeBlog = (blog) =>{
    return async (dispatch) =>{
        const updated = {...blog, likes : blog.likes +1, user: blog.user.id || blog.user}
        const blogUpdate = await blogService.update(blog.id, updated)
        const final = {...blogUpdate, user: blog.user}
        dispatch(updateBlog(final))
    }
}

export const deleteBlog = (id) =>{
    return async (dispatch) =>{
        dispatch(removeBlog(await blogService.deleteOne(id)))
    }
}
export default blogSlice.reducer
