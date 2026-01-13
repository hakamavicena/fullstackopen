import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMatch, Routes, Route, Link } from 'react-router-dom'

import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import {
  initializeBlogs,
  appendBlog,
  likeBlog,
  deleteBlog,
  commentBlog,
} from './reducers/blogReducer'
import { initializeUser, loginUser, logoutUser } from './reducers/loginReducer'
import { setNotification } from './reducers/notificationReducer'
import { initializeAllUsers } from './reducers/usersReducer'

const Users = ({ users }) => {
  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const User = ({ user }) => {
  if (!user) return null
  return (
    <div>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      <ul>
        {user.blogs.map((b) => {
          return <li>{b.title}</li>
        })}
      </ul>
    </div>
  )
}

const BlogDetail = ({ blog, handleLike, handleComment }) => {
  const [comment, setComment] = useState('')

  if (!blog) return null

  const onSubmit = (event) => {
    event.preventDefault()
    handleComment(blog.id, comment)
    setComment('')
  }
  return (
    <div>
      <h1>{blog.title}</h1>
      <Link to={blog.url}>{blog.url}</Link>
      <p>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </p>
      <p>added by {blog.user.name}</p>

      <h3>comments</h3>

      <form onSubmit={onSubmit}>
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          placeholder="write a comment..."
        />
        <button type="submit">add comment</button>
      </form>

      <ul>
        {blog.comments &&
          blog.comments.map((c, index) => <li key={index}>{c}</li>)}
      </ul>
    </div>
  )
}

const Navbar = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5,
  }
  return (
    <div className="nav">
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
const App = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()
  const matchBlog = useMatch('/blogs/:id')
  const matchUser = useMatch('/users/:id')

  const blogs = useSelector((state) => state.blogs)
  const users = useSelector((state) => state.users)
  const user = useSelector((state) => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeAllUsers())
  }, [dispatch])

  const blogSelected = matchBlog
    ? blogs.find((u) => u.id === String(matchBlog.params.id))
    : null

  const userSelected = matchUser
    ? users.find((b) => b.id === String(matchUser.params.id))
    : null

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      await dispatch(loginUser({ username, password }))
      setUsername('')
      setPassword('')
      // eslint-disable-next-line no-unused-vars, no-empty
    } catch (exception) {}
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      await dispatch(appendBlog(blogObject))

      dispatch(
        setNotification(`A new blog ${blogObject.title} added`, 'success', 5)
      )
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      dispatch(setNotification('Failed to create blog', 'error', 5))
    }
  }

  const handleComment = (id, content) => {
    dispatch(commentBlog(id, content))
    dispatch(setNotification('Comment added', 'success', 5))
  }

  const handleLike = (id, blog) => {
    dispatch(likeBlog(blog))
    dispatch(setNotification(`You liked ${blog.title}`, 'success', 5))
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id))
      dispatch(setNotification(`Blog ${blog.title} removed`, 'success', 5))
      dispatch(initializeBlogs())
      dispatch(initializeUser())
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )
  const blogsToShow = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {!user && loginForm()}
      {user && (
        <div>
          <Navbar user={user} handleLogout={handleLogout} />
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  {blogForm()}
                  {blogsToShow.map((blog) => (
                    <Blog
                      key={blog.id}
                      blog={blog}
                      addLike={handleLike}
                      deleteBlog={handleDelete}
                      user={user}
                    />
                  ))}
                </div>
              }
            />
            <Route
              path="/blogs/:id"
              element={
                <BlogDetail
                  blog={blogSelected}
                  handleLike={() => handleLike(blogSelected.id, blogSelected)}
                  handleComment={handleComment}
                />
              }
            />
            <Route path="/users" element={<Users users={users} />} />
            <Route path="users/:id" element={<User user={userSelected} />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
