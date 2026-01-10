import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [messageType, setMessageType] = useState("");

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setMessageType("error");
      setTimeout(() => {
        setErrorMessage(null)
        setMessageType('')
      }, 5000)
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

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))
      setErrorMessage(
        `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )
      setMessageType("success");
      setTimeout(() => {
        setErrorMessage(null)
        setMessageType('')
      }, 5000)
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to create blog'
      setErrorMessage(msg)
      setMessageType('error')
      setTimeout(() => {
        setErrorMessage(null)
        setMessageType('')
      }, 5000)
    }
  }

  const addLike = async (id, blogToUpdate) => {
    try {
      const updatedBlog = await blogService.update(id, blogToUpdate)

      const blogWithUser = {
        ...updatedBlog,
        user: blogs.find((b) => b.id === id).user,
      }

      const newBlogs = blogs.map((blog) =>
        blog.id === id ? blogWithUser : blog
      )
      setBlogs(newBlogs)
      setErrorMessage(
        `A blog ${updatedBlog.title} by ${updatedBlog.author} liked`
      )
      setMessageType('success')
      setTimeout(() => {
        setErrorMessage(null)
        setMessageType('')
      }, 5000)
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to like blog'
      setErrorMessage(msg)
      setMessageType('error')
      setTimeout(() => {
        setErrorMessage(null)
        setMessageType('')
      }, 5000)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await blogService.deleteOne(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      setErrorMessage(`Deleted ${blog.title}`)
      setMessageType('success')
      setTimeout(() => {
        setErrorMessage(null) 
        setMessageType('')}, 5000)
    } catch (error) {
      setErrorMessage(
        `Failed to delete blog: ${error.response?.data?.error || error.message}`
      )
      setMessageType('error')
      setTimeout(() => {setErrorMessage(null)
        setMessageType('')
      }, 5000)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )
  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const blogsToShow = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type={messageType}/>
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          {blogForm()}
          {blogsToShow.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              addLike={addLike}
              deleteBlog={deleteBlog}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
